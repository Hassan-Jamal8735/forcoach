"use client";

import { useRef, useState, useTransition } from "react";
import type { AdminBlogPost } from "@/lib/api/blog";
import { createBlogPost, updateBlogPost, uploadBlogImage } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // data:<type>;base64,<data> — strip the prefix, we send contentType separately.
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogFormDialog({
  post,
  onSaved,
  trigger,
}: {
  post?: AdminBlogPost;
  onSaved: () => void;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(undefined);
    setIsUploading(true);
    const inserted: string[] = [];
    for (const file of Array.from(files)) {
      const dataBase64 = await fileToBase64(file);
      const result = await uploadBlogImage(file.name, file.type, dataBase64);
      if (result.error) {
        setUploadError(result.error);
        continue;
      }
      if (result.url) inserted.push(`![](${result.url})`);
    }
    if (inserted.length > 0) {
      setContent((prev) =>
        prev ? `${prev}\n\n${inserted.join("\n\n")}` : inserted.join("\n\n"),
      );
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    setError(undefined);
    startTransition(async () => {
      const input = { title, slug, excerpt, content, published };
      const result = post
        ? await updateBlogPost(post.id, input)
        : await createBlogPost(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      onSaved();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(undefined);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{post ? "Edit post" : "New post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="blogTitle">Title *</Label>
            <Input
              id="blogTitle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blogSlug">URL slug *</Label>
            <Input
              id="blogSlug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
            />
            <p className="text-xs text-muted-foreground">
              forcoach.io/blog/{slug || "..."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="blogExcerpt">Excerpt</Label>
            <Textarea
              id="blogExcerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="One or two sentences shown on the blog list page."
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="blogContent">Content *</Label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageFiles(e.target.files)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? "Uploading..." : "Add images"}
                </Button>
              </div>
            </div>
            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
            <Textarea
              id="blogContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="font-mono text-xs"
              required
            />
            <p className="text-xs text-muted-foreground">
              Formatting: ## for a heading, **bold**, *italic*, [link
              text](https://...), and lines starting with &ldquo;- &rdquo;
              for a bulleted list. Leave a blank line between paragraphs.
              &ldquo;Add images&rdquo; uploads them straight to the server
              and inserts them into the content automatically — select
              multiple at once and move the resulting lines wherever you
              like.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="blogPublished"
              checked={published}
              onCheckedChange={(v) => setPublished(v === true)}
            />
            <Label htmlFor="blogPublished" className="font-normal">
              Published (visible on the public blog)
            </Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isPending || !title.trim() || !slug.trim() || !content.trim()}
              onClick={handleSubmit}
            >
              {isPending ? "Saving..." : post ? "Save changes" : "Create post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
