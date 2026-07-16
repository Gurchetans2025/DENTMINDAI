CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Dental Care',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at DESC);
CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug);

GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_manage_blog_posts()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
    OR lower(auth.jwt() ->> 'email') IN ('healthygrinsbylisha@gmail.com', 'admin@ai.com');
$$;

CREATE POLICY "Published blog posts are public"
  ON public.blog_posts
  FOR SELECT
  USING (is_published = true OR public.can_manage_blog_posts());

CREATE POLICY "Admins create blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (public.can_manage_blog_posts());

CREATE POLICY "Admins update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (public.can_manage_blog_posts())
  WITH CHECK (public.can_manage_blog_posts());

CREATE POLICY "Admins delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (public.can_manage_blog_posts());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
