import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog — FORCOACH",
  description:
    "Guides for independent fitness instructors teaching across multiple studios: invoicing, scheduling, and running your coaching business.",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guides for instructors teaching across multiple studios.
          </p>

          <div className="mt-10 space-y-4">
            {posts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No articles yet — check back soon.
              </p>
            )}
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="transition-colors hover:border-accent/40">
                  <CardHeader>
                    <p className="text-xs text-muted-foreground">
                      {dateFmt.format(new Date(post.date))}
                    </p>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {post.description}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
