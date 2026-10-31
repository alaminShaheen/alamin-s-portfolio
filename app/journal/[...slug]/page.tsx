import { notFound } from "next/navigation"
import {
  getJournalEntryBySlug,
  getJournalContent,
  getReadingTime,
  getAllJournalSlugs,
} from "@/lib/journal"
import { MDX } from "@/app/blog/[slug]/mdx"
import { PageHeading } from "@/components/page-heading"
import { BackLink } from "@/components/back-link"
import { formatDateLong } from "@/lib/utils"
import { site } from "@/content/site"
import type { Metadata } from "next"

type PageProps = {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const { slug } = await params
  const fullSlug = slug.join("/")
  const entry = getJournalEntryBySlug(fullSlug)

  if (!entry) return

  return {
    title: entry.metadata.title,
    description: entry.metadata.description ?? `Journal entry: ${entry.metadata.title}`,
    openGraph: {
      title: entry.metadata.title,
      description: entry.metadata.description,
      type: "article",
      url: `/journal/${fullSlug}`,
    },
  }
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params
  const fullSlug = slug.join("/")
  const entry = getJournalEntryBySlug(fullSlug)
  const Content = getJournalContent(fullSlug)

  if (!entry || !Content) {
    notFound()
  }

  const readingTime = getReadingTime(entry.content)
  const breadcrumb = slug.slice(0, -1).join(" / ")

  return (
    <article>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.metadata.title,
            datePublished: entry.metadata.date,
            description: entry.metadata.description,
            url: `${site.url}/journal/${fullSlug}`,
            author: {
              "@type": "Person",
              name: site.name,
            },
          }),
        }}
      />

      <div className="flex items-center justify-between mb-8">
        <BackLink href="/journal">journal</BackLink>
        {breadcrumb && (
          <span className="text-sm text-gray-600">{breadcrumb}</span>
        )}
      </div>

      {entry.metadata.draft && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-yellow-500 text-sm">
          This entry is a draft and is not listed publicly.
        </div>
      )}

      <PageHeading size="md" className="mb-4">{entry.metadata.title}</PageHeading>

      <div className="mb-8 flex items-center gap-3 text-sm text-gray-500">
        <span>{formatDateLong(entry.metadata.date)}</span>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </div>

      <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-tuned-mono text-pretty">
        <MDX Content={Content} />
      </div>
    </article>
  )
}

export function generateStaticParams() {
  return getAllJournalSlugs().map((slugParts) => ({
    slug: slugParts,
  }))
}
