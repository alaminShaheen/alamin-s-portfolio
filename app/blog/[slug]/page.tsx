import { notFound } from "next/navigation"
import Link from "next/link"
import { MDX } from "./mdx"
import {
  getPostBySlug,
  getPostContent,
  getAdjacentPosts,
  getReadingTime,
  getPublishedPosts,
  getPostUrl,
} from "@/lib/blog"
import { PageHeading } from "@/components/page-heading"
import { BackLink } from "@/components/back-link"
import { formatDateLong } from "@/lib/utils"
import { site } from "@/content/site"
import type { Metadata } from "next"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return

  const publishedTime = formatDateLong(post.metadata.date)
  const ogImage = `/og/blog?title=${encodeURIComponent(post.metadata.title)}`

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime,
      type: "article",
      url: getPostUrl(post),
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
  const { slug } = await params
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
            image: `${site.url}/og/blog?title=${encodeURIComponent(
              post.metadata.title,
            )}&top=${encodeURIComponent(formatDateLong(post.metadata.date))}`,
            url: `${site.url}${getPostUrl(post)}`,
            author: {
              "@type": "Person",
              name: site.name,
            },
          }),
        }}
      />

      <div className="mb-8">
        <BackLink href="/blog">blog</BackLink>
      </div>

      {post.metadata.draft && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-yellow-500 text-sm">
          This post is a draft and is not listed publicly.
        </div>
      )}

      <PageHeading balance className="mb-4">{post.metadata.title}</PageHeading>

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
              href={getPostUrl(prev)}
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
              href={getPostUrl(next)}
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

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({
    slug: post.slug,
  }))
}
