"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Folder, FileText } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { TreeNode } from "@/lib/journal"

type JournalTreeProps = {
  tree: TreeNode[]
}

function TreeNodeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const isActive = pathname === `/journal/${node.path}`

  if (node.type === "file") {
    return (
      <Link
        href={`/journal/${node.path}`}
        className={`flex items-center gap-2 py-1.5 px-2 rounded text-sm transition-colors duration-200 ${
          isActive
            ? "bg-accent/10 text-accent"
            : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <FileText className="w-4 h-4 shrink-0" />
        <span className="truncate">{node.entry?.metadata.title ?? node.name}</span>
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1.5 px-2 rounded text-sm w-full text-left text-gray-300 hover:text-white hover:bg-neutral-800/50 transition-colors duration-200"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-3 h-3 shrink-0" />
        </motion.div>
        <Folder className="w-4 h-4 shrink-0 text-accent" />
        <span className="truncate">{node.name}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNodeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function JournalTree({ tree }: JournalTreeProps) {
  return (
    <nav className="space-y-1">
      {tree.map((node) => (
        <TreeNodeItem key={node.path} node={node} />
      ))}
    </nav>
  )
}
