import { supabase } from "@/integrations/supabase/client";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type BlogPostRow = Record<string, unknown>;

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "fallback-hygiene",
    title: "The 2-minute rule that saves your teeth",
    slug: "the-2-minute-rule-that-saves-your-teeth",
    category: "Hygiene",
    excerpt: "The science behind brushing time, technique, and timing.",
    content:
      "Brushing for two full minutes gives fluoride enough contact time and helps you clean every surface with less pressure. Use a soft brush, small circular motions, and finish by cleaning your tongue.",
    imageUrl: null,
    isPublished: true,
    publishedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-whitening",
    title: "In-clinic vs. at-home whitening",
    slug: "in-clinic-vs-at-home-whitening",
    category: "Whitening",
    excerpt: "What actually works and what damages enamel.",
    content:
      "Whitening works best after a dentist checks stains, sensitivity, gums, and existing fillings. In-clinic whitening is faster, while dentist-guided home trays can be gentler and easier to maintain.",
    imageUrl: null,
    isPublished: true,
    publishedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-kids",
    title: "Your child's first dental visit",
    slug: "your-childs-first-dental-visit",
    category: "Kids",
    excerpt: "A stress-free checklist for parents.",
    content:
      "Keep the first visit simple, positive, and calm. Bring your child's medical details, avoid scary words, and let the dentist guide the introduction at the child's pace.",
    imageUrl: null,
    isPublished: true,
    publishedAt: null,
    createdAt: "",
    updatedAt: "",
  },
];

export async function fetchPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const query = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const { data, error } = limit ? await query.limit(limit) : await query;
  if (error) return fallbackBlogPosts.slice(0, limit);
  const posts = (data ?? []).map(toBlogPost);
  return posts.length ? posts : fallbackBlogPosts.slice(0, limit);
}

export async function fetchAdminBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toBlogPost);
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `blog-${Date.now()}`;
}

export function formatBlogDate(value: string | null) {
  if (!value) return "Draft";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Draft";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? "Untitled article"),
    slug: String(row.slug ?? ""),
    category: String(row.category ?? "Dental Care"),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    imageUrl: row.image_url ? String(row.image_url) : null,
    isPublished: Boolean(row.is_published),
    publishedAt: row.published_at ? String(row.published_at) : null,
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}
