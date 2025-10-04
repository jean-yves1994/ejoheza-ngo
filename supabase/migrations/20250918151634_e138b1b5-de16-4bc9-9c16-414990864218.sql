-- Create user roles system to fix volunteer data security vulnerability

-- 1. Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table to manage user permissions
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- 5. Insert admin role for existing admin user (based on auth logs)
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'admin@ejoheza.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin());

-- 7. Drop existing insecure volunteer policies
DROP POLICY IF EXISTS "Allow authenticated users to manage volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Allow authenticated users to view volunteers" ON public.volunteers;

-- 8. Create secure volunteer policies
-- Anyone can apply to be a volunteer (public registration)
CREATE POLICY "Anyone can apply as volunteer" 
ON public.volunteers 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view all volunteers (for management)
CREATE POLICY "Admins can view all volunteers" 
ON public.volunteers 
FOR SELECT 
USING (public.is_admin());

-- Only admins can update volunteer status
CREATE POLICY "Admins can update volunteers" 
ON public.volunteers 
FOR UPDATE 
USING (public.is_admin());

-- Only admins can delete volunteer records
CREATE POLICY "Admins can delete volunteers" 
ON public.volunteers 
FOR DELETE 
USING (public.is_admin());

-- 9. Create trigger to automatically assign 'user' role to new signups
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();