import type { MDXComponents, MDXContent } from "mdx/types"
import Link from "next/link"
import { Children, createElement, isValidElement } from "react"
import { CodeBlock } from "@/components/code-block"

type TableData = {
  headers: string[]
  rows: string[][]
}

function Table({
  data,
  ascii = false,
}: {
  data: TableData
  ascii?: boolean
}) {
  if (!data.headers.length || !data.rows.length) {
    return null
  }

  if (ascii) {
    const allRows = [data.headers, ...data.rows]
    const colWidths = data.headers.map((_, colIndex) =>
      Math.max(...allRows.map((row) => (row[colIndex] ?? "").length)),
    )

    const formatRow = (row: string[]) =>
      "| " +
      row.map((cell, i) => cell.padEnd(colWidths[i] ?? 0)).join(" | ") +
      " |"

    const separator =
      "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+"

    const lines = [
      separator,
      formatRow(data.headers),
      separator,
      ...data.rows.map(formatRow),
      separator,
    ]

    return (
      <div className="font-mono text-sm overflow-x-auto whitespace-pre">
        {lines.join("\n")}
      </div>
    )
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index} className="p-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="p-2 text-left">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CustomLink({
  href,
  ...props
}: React.ComponentProps<typeof Link> & { href: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return <a {...props} />
  }

  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
}

function CustomImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={props.alt} className="rounded-lg" {...props} />
}

function Note({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="my-6 border-l-2 border-accent/40 bg-neutral-900/40 px-4 py-3 text-sm text-gray-400 [&>p]:my-0">
      {children}
    </aside>
  )
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (!node) return ""

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("")
  }

  if (isValidElement(node)) {
    return extractTextContent(node.props.children)
  }

  return ""
}

function Figure({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // Check if this is a rehype-pretty-code figure
  const dataAttr = (props as Record<string, unknown>)["data-rehype-pretty-code-figure"]
  if (dataAttr !== undefined) {
    // Extract text content from the code block for the copy button
    const code = extractTextContent(children)
    return <CodeBlock code={code.trimEnd()}>{children}</CodeBlock>
  }

  return <figure {...props}>{children}</figure>
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

function createHeading(level: number) {
  const HeadingComponent = ({ children }: { children: React.ReactNode }) => {
    const childrenString = Children.toArray(children).join("")
    const slug = slugify(childrenString)
    return createElement(`h${level}`, { id: slug }, [
      createElement(
        "a",
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        },
        children,
      ),
    ])
  }
  HeadingComponent.displayName = `Heading${level}`
  return HeadingComponent
}

const components = {
  a: CustomLink,
  img: CustomImage,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  figure: Figure,
  Table,
  Note,
}

export function MDX({
  Content,
  components: overrides,
}: {
  Content: MDXContent
  components?: MDXComponents
}) {
  return <Content components={{ ...components, ...(overrides ?? {}) }} />
}
