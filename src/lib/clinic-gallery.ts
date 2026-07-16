import { supabase } from "@/integrations/supabase/client";

export const CLINIC_GALLERY_BUCKET = "clinic-gallery";

export type ClinicGalleryImage = {
  id: string;
  title: string;
  altText: string;
  imageUrl: string;
  storagePath: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
};

type GalleryRow = Record<string, unknown>;

export const fallbackClinicGalleryImages: ClinicGalleryImage[] = [
  {
    id: "clinic-gallery-img-6647",
    title: "HealthyGrinz clinic photo",
    altText: "HealthyGrinz clinic interior photo",
    imageUrl: "/clinic-gallery/IMG_6647_HEIC.avif",
    storagePath: null,
    sortOrder: 0,
    isPublished: true,
    createdAt: "",
  },
];

export async function fetchPublishedClinicGallery(): Promise<ClinicGalleryImage[]> {
  const { data, error } = await supabase
    .from("clinic_gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return fallbackClinicGalleryImages;
  const images = (data ?? []).map(toClinicGalleryImage);
  return images.length ? images : fallbackClinicGalleryImages;
}

export async function fetchAdminClinicGallery(): Promise<ClinicGalleryImage[]> {
  const { data, error } = await supabase
    .from("clinic_gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toClinicGalleryImage);
}

export function galleryStoragePath(userId: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  return `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

function toClinicGalleryImage(row: GalleryRow): ClinicGalleryImage {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? "Clinic photo"),
    altText: String(row.alt_text ?? "HealthyGrinz clinic photo"),
    imageUrl: String(row.image_url ?? ""),
    storagePath: row.storage_path ? String(row.storage_path) : null,
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: String(row.created_at ?? ""),
  };
}
