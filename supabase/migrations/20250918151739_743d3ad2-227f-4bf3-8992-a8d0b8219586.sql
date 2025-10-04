-- Fix donation data security vulnerability - restrict access to admins only

-- Drop existing insecure donation policies that allow any authenticated user to view/manage donations
DROP POLICY IF EXISTS "Allow authenticated users to manage donations" ON public.donations;
DROP POLICY IF EXISTS "Allow authenticated users to view donations" ON public.donations;

-- Keep public donation insertion policy (for donation forms on website)
-- This policy already exists: "Allow anyone to insert donations"

-- Create secure admin-only policies for donation management
CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update donations" 
ON public.donations 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete donations" 
ON public.donations 
FOR DELETE 
USING (public.is_admin());