import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { fetchPublishedPost } from "@/lib/blog/api";
import { renderMarkdown } from "@/lib/blog/markdown";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — FORCOACH Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPublishedPost(slug);
  if (!post) notFound();

  return (
    <div className="theme-public flex min-h-screen flex-col bg-background">
      <MarketingNav />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Blog
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dateFmt.format(new Date(post.published_at ?? post.created_at))}
          </p>
          <div className="mt-8 max-w-none space-y-4 text-sm leading-relaxed text-foreground/90 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {renderMarkdown(post.content)}
          </div>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
