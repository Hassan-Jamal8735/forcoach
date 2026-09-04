"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { AdminBlogPost } from "@/lib/api/blog";
import { deleteBlogPost, fetchBlogPosts, updateBlogPost } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlogFormDialog } from "./blog-form-dialog";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function BlogPostsPanel({
  initialPosts,
}: {
  initialPosts: AdminBlogPost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    const result = await fetchBlogPosts();
    if (result.posts) setPosts(result.posts);
  }

  function handleTogglePublished(post: AdminBlogPost) {
    startTransition(async () => {
      const result = await updateBlogPost(post.id, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published: !post.published,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      await refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteBlogPost(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      await refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <BlogFormDialog
          onSaved={refresh}
          trigger={
            <Button>
              <Plus className="mr-1.5 size-4" />
              New post
            </Button>
          }
        />
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={post.published ? "secondary" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {dateFmt.format(new Date(post.updated_at))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleTogglePublished(post)}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <BlogFormDialog
                        post={post}
                        onSaved={refresh}
                        trigger={
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              Delete
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete &ldquo;{post.title}&rdquo;?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes the post. This cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={isPending}
                              onClick={() => handleDelete(post.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No posts yet — write your first one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
