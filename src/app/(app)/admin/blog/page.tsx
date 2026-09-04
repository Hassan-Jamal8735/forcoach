import { apiFetch } from "@/lib/api/server-client";
import type { AdminBlogPost } from "@/lib/api/blog";
import { BlogPostsPanel } from "./blog-posts-panel";

export default async function AdminBlogPage() {
  const posts = await apiFetch<AdminBlogPost[]>("/admin/blog");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="text-muted-foreground mt-1">
          Write and publish articles yourself — they go live on{" "}
          <span className="font-mono text-xs">/blog</span> as soon as you
          publish.
        </p>
      </div>
      <BlogPostsPanel initialPosts={posts} />
    </div>
  );
}
