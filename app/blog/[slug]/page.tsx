import { notFound } from "next/navigation"
import Link from "next/link"
import { MDX } from "./mdx"
import {
  getPostBySlug,
  getPostContent,
  getAdjacentPosts,
  getReadingTime,
} from "@/lib/blog"
import { formatDateLong } from "@/lib/utils"
import { site } from "@/content/site"
import type { Metadata } from "next"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const slug = (await params).slug
  const post = getPostBySlug(slug)
  if (!post) {
    return
  }

  const publishedTime = formatDateLong(post.metadata.date)

  // Relative — metadataBase in app/layout.tsx turns these into absolute URLs
  // for whatever origin the site is deployed on.
  const ogImage = `/og/blog?title=${encodeURIComponent(post.metadata.title)}`

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime,
      type: "article",
      url: `/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      card: "summary_large_image",
      ...(site.twitter ? { creator: site.twitter } : {}),
      images: [`${ogImage}&top=${encodeURIComponent(publishedTime)}`],
    },
  }
}

export default async function Post({ params }: PageProps) {
  const slug = (await params).slug
  const post = getPostBySlug(slug)
  const Content = getPostContent(slug)
  if (!post || !Content) {
    notFound()
  }

  const { prev, next } = getAdjacentPosts(slug)
  const readingTime = getReadingTime(post.content)

  return (
    <section className="animate-fade-in-up">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.date,
            dateModified: post.metadata.date,
            description: post.metadata.description,
            // JSON-LD is raw text in a <script>, so metadataBase does not
            // apply here — these must be built from site.url explicitly.
            image: `${site.url}/og/blog?title=${encodeURIComponent(
              post.metadata.title,
            )}&top=${encodeURIComponent(formatDateLong(post.metadata.date))}`,
            url: `${site.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: site.name,
            },
          }),
        }}
      />

      <div className="flex items-center justify-between mb-8">
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-accent transition-colors duration-200"
        >
          &larr; back
        </Link>
      </div>

      {post.metadata.draft && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-yellow-500 text-sm">
          This post is a draft and is not listed publicly.
        </div>
      )}

      <h1 className="text-4xl font-semibold mb-4 text-white text-balance">
        <span className="text-accent accent-glow mr-2">*</span>
        {post.metadata.title}
      </h1>

      <div className="mb-10 flex items-center gap-3 text-sm text-gray-500">
        <span>{formatDateLong(post.metadata.date)}</span>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </div>

      <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-tuned-mono text-pretty">
        <MDX Content={Content} />
      </article>

      {(prev || next) && (
        <nav className="mt-16 border-t border-neutral-800 pt-8 grid grid-cols-2 gap-4 text-sm">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              <span className="text-xs text-gray-600 mb-1 block">previous</span>
              <span className="group-hover:text-accent transition-colors duration-200">
                &larr; {prev.metadata.title.toLowerCase()}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group text-right text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              <span className="text-xs text-gray-600 mb-1 block">next</span>
              <span className="group-hover:text-accent transition-colors duration-200">
                {next.metadata.title.toLowerCase()} &rarr;
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </section>
  )
}
