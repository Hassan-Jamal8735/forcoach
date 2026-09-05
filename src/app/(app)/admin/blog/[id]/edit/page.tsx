import { apiFetch } from "@/lib/api/server-client";
import type { AdminBlogPost } from "@/lib/api/blog";
import { BlogEditorForm } from "../../blog-editor-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await apiFetch<AdminBlogPost>(`/admin/blog/${id}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <p className="text-muted-foreground mt-1">{post.title}</p>
      </div>
      <BlogEditorForm post={post} />
    </div>
  );
}
