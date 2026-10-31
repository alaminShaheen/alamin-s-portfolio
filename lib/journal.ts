import type { MDXContent } from "mdx/types"
import { z } from "zod"

const metadataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  order: z.coerce.number().optional().default(999),
  draft: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .default(false),
}).passthrough() // Allow extra fields like tags

export type JournalMetadata = z.infer<typeof metadataSchema>

export type JournalEntry = {
  metadata: JournalMetadata
  content: string
  slug: string // full path like "aws/ec2/launching-instance"
  path: string[] // ["aws", "ec2", "launching-instance"]
}

export type TreeNode = {
  name: string
  type: "folder" | "file"
  path: string
  children?: TreeNode[]
  entry?: JournalEntry
}

// Glob all mdx files from journal directory - supports infinite nesting
const rawEntries = import.meta.glob("../content/journal/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const compiledEntries = import.meta.glob("../content/journal/**/*.mdx", {
  eager: true,
}) as Record<string, { default: MDXContent }>

// Extract slug from file path: ../content/journal/aws/ec2/launch.mdx -> aws/ec2/launch
const slugOf = (filePath: string) => {
  const match = filePath.match(/\.\.\/content\/journal\/(.+)\.mdx$/)
  return match ? match[1] : ""
}

function parseFrontmatter(fileContent: string): { metadata: JournalMetadata; content: string } {
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

const entries: JournalEntry[] = Object.entries(rawEntries).map(
  ([filePath, rawContent]) => {
    const slug = slugOf(filePath)
    const path = slug.split("/")
    return {
      ...parseFrontmatter(rawContent),
      slug,
      path,
    }
  }
)

const contentBySlug = new Map<string, MDXContent>(
  Object.entries(compiledEntries).map(([filePath, mod]) => [
    slugOf(filePath),
    mod.default,
  ])
)

export function getJournalEntries(): JournalEntry[] {
  return entries.filter((entry) => !entry.metadata.draft)
}

export function getJournalEntryBySlug(slug: string): JournalEntry | null {
  // Decode the slug to handle URL-encoded characters (spaces, parentheses, etc.)
  const decodedSlug = decodeURIComponent(slug)
  return entries.find((entry) => entry.slug === decodedSlug) ?? null
}

export function getJournalContent(slug: string): MDXContent | null {
  const decodedSlug = decodeURIComponent(slug)
  return contentBySlug.get(decodedSlug) ?? null
}

export function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 225))
  return `${minutes} min read`
}

// Build tree structure from flat entries
export function buildJournalTree(): TreeNode[] {
  const root: TreeNode[] = []

  for (const entry of getJournalEntries()) {
    let currentLevel = root

    for (let i = 0; i < entry.path.length; i++) {
      const part = entry.path[i]
      const isLast = i === entry.path.length - 1
      const pathSoFar = entry.path.slice(0, i + 1).join("/")

      let existing = currentLevel.find((node) => node.name === part)

      if (!existing) {
        if (isLast) {
          // This is the file
          existing = {
            name: part,
            type: "file",
            path: pathSoFar,
            entry,
          }
        } else {
          // This is a folder
          existing = {
            name: part,
            type: "folder",
            path: pathSoFar,
            children: [],
          }
        }
        currentLevel.push(existing)
      }

      if (!isLast && existing.children) {
        currentLevel = existing.children
      }
    }
  }

  // Sort: folders first, then files, by order field (default 999), then alphabetically
  const sortTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .map((node) => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined,
      }))
      .sort((a, b) => {
        // Folders before files
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1
        }
        // For files, sort by order field
        if (a.type === "file" && b.type === "file") {
          const orderA = a.entry?.metadata.order ?? 999
          const orderB = b.entry?.metadata.order ?? 999
          if (orderA !== orderB) {
            return orderA - orderB
          }
        }
        // Fall back to alphabetical
        return a.name.localeCompare(b.name)
      })
  }

  return sortTree(root)
}

// Get all slugs for static generation
export function getAllJournalSlugs(): string[][] {
  return getJournalEntries().map((entry) => entry.path)
}
