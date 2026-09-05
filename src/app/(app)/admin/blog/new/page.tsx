import { BlogEditorForm } from "../blog-editor-form";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New post</h1>
        <p className="text-muted-foreground mt-1">
          Write and publish a new article to the public blog.
        </p>
      </div>
      <BlogEditorForm />
    </div>
  );
}
