// Public blog reads (anonymous visitors, no session) — separate from
// `apiFetch` in lib/api/server-client.ts, which requires an authenticated
// session and 401s otherwise.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_URL}/blog`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPublishedPost(
  slug: string,
): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/blog/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}
