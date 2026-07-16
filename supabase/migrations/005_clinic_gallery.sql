CREATE TABLE public.clinic_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Clinic photo',
  alt_text TEXT NOT NULL DEFAULT 'HealthyGrinz clinic photo',
  image_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX clinic_gallery_images_sort_idx
  ON public.clinic_gallery_images (is_published, sort_order, created_at DESC);

GRANT SELECT ON public.clinic_gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clinic_gallery_images TO authenticated;
GRANT ALL ON public.clinic_gallery_images TO service_role;

ALTER TABLE public.clinic_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published clinic gallery images are public"
  ON public.clinic_gallery_images
  FOR SELECT
  USING (is_published = true OR public.can_manage_blog_posts());

CREATE POLICY "Admins create clinic gallery images"
  ON public.clinic_gallery_images
  FOR INSERT
  WITH CHECK (public.can_manage_blog_posts());

CREATE POLICY "Admins update clinic gallery images"
  ON public.clinic_gallery_images
  FOR UPDATE
  USING (public.can_manage_blog_posts())
  WITH CHECK (public.can_manage_blog_posts());

CREATE POLICY "Admins delete clinic gallery images"
  ON public.clinic_gallery_images
  FOR DELETE
  USING (public.can_manage_blog_posts());

CREATE TRIGGER set_clinic_gallery_images_updated_at
  BEFORE UPDATE ON public.clinic_gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic-gallery', 'clinic-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Clinic gallery images are public"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'clinic-gallery');

CREATE POLICY "Admins upload clinic gallery images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'clinic-gallery' AND public.can_manage_blog_posts());

CREATE POLICY "Admins update clinic gallery images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'clinic-gallery' AND public.can_manage_blog_posts())
  WITH CHECK (bucket_id = 'clinic-gallery' AND public.can_manage_blog_posts());

CREATE POLICY "Admins delete clinic gallery images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'clinic-gallery' AND public.can_manage_blog_posts());
