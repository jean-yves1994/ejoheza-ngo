-- Fix news and event management security vulnerabilities
-- Restrict CREATE/UPDATE/DELETE operations to admins only

-- Fix News Posts RLS Policies
-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage news" ON public.news_posts;

-- Create admin-only policies for news management
CREATE POLICY "Admins can create news posts" 
ON public.news_posts 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update news posts" 
ON public.news_posts 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete news posts" 
ON public.news_posts 
FOR DELETE 
USING (public.is_admin());

-- Fix Events RLS Policies  
-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage events" ON public.events;

-- Create admin-only policies for event management
CREATE POLICY "Admins can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events" 
ON public.events 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
USING (public.is_admin());