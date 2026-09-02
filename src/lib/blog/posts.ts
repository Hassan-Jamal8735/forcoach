import type { BlogPost } from "./types";
import { post as howToInvoiceFitnessStudios } from "./posts/how-to-invoice-fitness-studios";

// Add a new file under ./posts/, then list it here. Newest first isn't
// required — getAllPosts() sorts by date automatically.
const ALL_POSTS: BlogPost[] = [howToInvoiceFitnessStudios];

export function getAllPosts(): BlogPost[] {
  return [...ALL_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}
