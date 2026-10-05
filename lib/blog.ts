import type { MDXContent } from "mdx/types"
import { z } from "zod"

const metadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  draft: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .default(false),
})

export type Metadata = z.infer<typeof metadataSchema>

export type FrontmatterParseResult = {
  metadata: Metadata
  content: string
}

// Stays serializable: this crosses into client components (components/posts.tsx),
// and functions cannot be passed over the RSC boundary. The compiled component
// is fetched separately by the server page via getPostContent().
export type MDXFileData = FrontmatterParseResult & {
  slug: string
}

// Both globs are resolved by Vite at build time: Workers have no filesystem,
// so posts must never be read from disk at request time. `?raw` gives the
// source (for frontmatter, reading time and headings); the plain glob gives
// the compiled component.
const rawPosts = import.meta.glob("../app/posts/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const compiledPosts = import.meta.glob("../app/posts/*.mdx", {
  eager: true,
}) as Record<string, { default: MDXContent }>

const slugOf = (filePath: string) =>
  filePath.split("/").pop()!.replace(/\.mdx$/, "")

const posts: MDXFileData[] = Object.entries(rawPosts).map(
  ([filePath, rawContent]) => ({
    ...parseFrontmatter(rawContent),
    slug: slugOf(filePath),
  }),
)

const contentBySlug = new Map<string, MDXContent>(
  Object.entries(compiledPosts).map(([filePath, mod]) => [
    slugOf(filePath),
    mod.default,
  ]),
)

/** Compiled at build time — Workers forbid runtime codegen, so MDX can never be
 *  compiled per request. Server components only; this is a function. */
export function getPostContent(slug: string): MDXContent | null {
  return contentBySlug.get(slug) ?? null
}

export function getPosts(): MDXFileData[] {
  return posts
}

export function getPublishedPosts(): MDXFileData[] {
  return getPosts().filter((post) => !post.metadata.draft)
}

export function getPostBySlug(slug: string): MDXFileData | null {
  return getPosts().find((post) => post.slug === slug) ?? null
}

export function getAdjacentPosts(slug: string): {
  prev: MDXFileData | null
  next: MDXFileData | null
} {
  const posts = getPublishedPosts().sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
  )
  const index = posts.findIndex((post) => post.slug === slug)
  return {
    prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
    next: index > 0 ? (posts[index - 1] ?? null) : null,
  }
}

export function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 225))
  return `${minutes} min read`
}

export function extractHeadings(
  content: string,
): { text: string; slug: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: { text: string; slug: string; level: number }[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]!.length
    const text = match[2]!.trim()
    const slug = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
    headings.push({ text, slug, level })
  }

  return headings
}

function parseFrontmatter(fileContent: string): FrontmatterParseResult {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match?.[1]) {
    throw new Error("No frontmatter found")
  }

  const content = fileContent.replace(frontmatterRegex, "").trim()
  const frontmatterLines = match[1].trim().split("\n")
  const raw: Record<string, string> = {}

  for (const line of frontmatterLines) {
    const [key, ...values] = line.split(": ")
    if (!key) continue
    let value = values.join(": ").trim()
    value = value.replace(/^['"](.*)['"]$/, "$1")
    if (value) {
      raw[key.trim()] = value
    }
  }

  const metadata = metadataSchema.parse(raw)
  return { metadata, content }
}

