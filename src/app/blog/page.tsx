import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { fetchPublishedPosts } from "@/lib/blog/api";

export const dynamic = "force-dynamic";

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

export default async function BlogIndexPage() {
  const posts = await fetchPublishedPosts();

  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guides for instructors teaching across multiple studios.
          </p>

          {posts.length === 0 && (
            <p className="mt-10 text-sm text-muted-foreground">
              No articles yet — check back soon.
            </p>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
              >
                <p className="text-xs font-medium tracking-wide text-accent uppercase">
                  {dateFmt.format(new Date(post.published_at ?? post.created_at))}
                </p>
                <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Read article
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
