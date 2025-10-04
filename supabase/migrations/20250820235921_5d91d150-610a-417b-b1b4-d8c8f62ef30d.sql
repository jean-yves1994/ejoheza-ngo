-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  address TEXT,
  skills TEXT[],
  availability TEXT,
  motivation TEXT,
  experience TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  donation_type TEXT DEFAULT 'one-time' CHECK (donation_type IN ('one-time', 'monthly', 'yearly')),
  purpose TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_posts table
CREATE TABLE public.news_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  event_type TEXT DEFAULT 'general' CHECK (event_type IN ('general', 'training', 'competition', 'workshop', 'fundraising')),
  max_participants INTEGER,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for volunteers
CREATE POLICY "Anyone can insert volunteer applications" ON public.volunteers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own volunteer applications" ON public.volunteers
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all volunteer applications" ON public.volunteers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update volunteer applications" ON public.volunteers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for donations
CREATE POLICY "Anyone can insert donations" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own donations" ON public.donations
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update donations" ON public.donations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for news_posts
CREATE POLICY "Published posts are viewable by everyone" ON public.news_posts
  FOR SELECT USING (status = 'published' OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins and editors can manage posts" ON public.news_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

-- RLS Policies for team_members
CREATE POLICY "Active team members are viewable by everyone" ON public.team_members
  FOR SELECT USING (is_active = true OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_posts_updated_at
  BEFORE UPDATE ON public.news_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample team members
INSERT INTO public.team_members (name, position, bio, order_index) VALUES
('John Doe', 'Executive Director', 'Passionate about youth development through sports with over 15 years of experience in community organizations.', 1),
('Jane Smith', 'Head Coach', 'Former professional athlete with expertise in football training and youth development programs.', 2),
('Michael Johnson', 'Program Coordinator', 'Dedicated to creating opportunities for young athletes and managing community outreach programs.', 3),
('Sarah Wilson', 'Finance Director', 'Ensuring transparent financial management and sustainable funding for all our programs.', 4);

-- Insert sample news posts
INSERT INTO public.news_posts (title, slug, content, excerpt, status, published_at) VALUES
('EJO Heza Launches New Football Academy', 'ejo-heza-launches-new-football-academy', 'We are excited to announce the launch of our new football academy, designed to nurture young talent and provide professional training opportunities. The academy will offer comprehensive programs for different age groups and skill levels.', 'New football academy launching with comprehensive programs for youth development.', 'published', now()),
('Community Fitness Program Success', 'community-fitness-program-success', 'Our monthly community fitness events have been a tremendous success, with over 200 participants joining our latest session. These programs are designed to promote healthy lifestyles and community engagement.', 'Monthly fitness programs showing great community participation and engagement.', 'published', now() - interval '1 week'),
('Youth Talent Show Highlights', 'youth-talent-show-highlights', 'The quarterly youth talent show showcased incredible creativity and skill from our young participants. From music performances to artistic displays, the event celebrated the diverse talents within our community.', 'Quarterly talent show celebrates diverse youth talents and creativity.', 'published', now() - interval '2 weeks');

-- Insert sample events
INSERT INTO public.events (title, description, start_date, location, event_type) VALUES
('Football Training Camp', 'Intensive 3-day football training camp for youth aged 12-18. Professional coaches will provide specialized training in techniques, tactics, and fitness.', now() + interval '2 weeks', 'EJO Heza Training Center', 'training'),
('Community Fundraising Gala', 'Annual fundraising event to support our programs and facilities. Join us for an evening of entertainment, networking, and community support.', now() + interval '1 month', 'Community Center Hall', 'fundraising'),
('Youth Talent Competition', 'Quarterly competition showcasing young talents in various categories including music, arts, and sports.', now() + interval '6 weeks', 'EJO Heza Youth Center', 'competition');