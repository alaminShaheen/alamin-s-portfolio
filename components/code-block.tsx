"use client"

import { type ReactNode } from "react"
import { CopyButton } from "./copy-button"

export function CodeBlock({
  children,
  code,
}: {
  children: ReactNode
  code: string
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="group relative">
      <CopyButton text={code} />
      {children}
    </figure>
  )
}
