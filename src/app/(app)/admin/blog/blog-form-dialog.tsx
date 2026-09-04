"use client";

import { useState, useTransition } from "react";
import type { AdminBlogPost } from "@/lib/api/blog";
import { createBlogPost, updateBlogPost } from "../actions";
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
  const [imageUrls, setImageUrls] = useState("");

  function insertImages() {
    const urls = imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) return;
    const inserted = urls.map((u) => `![](${u})`).join("\n\n");
    setContent((prev) => (prev ? `${prev}\n\n${inserted}` : inserted));
    setImageUrls("");
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
            <Label htmlFor="blogImageUrls">Add images (optional)</Label>
            <div className="flex gap-2">
              <Textarea
                id="blogImageUrls"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                rows={2}
                placeholder={"One image URL per line"}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                onClick={insertImages}
                disabled={!imageUrls.trim()}
              >
                Insert
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste a link to an image (e.g. from a photo you&apos;ve
              uploaded to any image host) and it&apos;s added into the
              content below — move it wherever you like.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="blogContent">Content *</Label>
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
