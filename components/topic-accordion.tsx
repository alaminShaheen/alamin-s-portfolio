"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion, MotionConfig } from "motion/react"
import { type MDXFileData, getPostUrl } from "@/lib/blog"
import { formatDate } from "@/lib/utils"

type TopicAccordionProps = {
  groupedPosts: Record<string, MDXFileData[]>
}

export function TopicAccordion({ groupedPosts }: TopicAccordionProps) {
  const topics = Object.keys(groupedPosts).sort()
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(topics) // all expanded by default
  )

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) {
        next.delete(topic)
      } else {
        next.add(topic)
      }
      return next
    })
  }

  return (
    <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
      <div className="space-y-4">
        {topics.map((topic) => {
          const posts = groupedPosts[topic]
          const isExpanded = expandedTopics.has(topic)

          return (
            <motion.div
              key={topic}
              initial={false}
              animate={isExpanded ? "open" : "closed"}
            >
              <button
                onClick={() => toggleTopic(topic)}
                className="flex items-center gap-2 text-left w-full group"
              >
                <motion.div
                  variants={{
                    open: { rotate: 90 },
                    closed: { rotate: 0 },
                  }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </motion.div>
                <span className="text-lg font-semibold text-white font-incognito group-hover:text-accent transition-colors duration-200">
                  {topic}
                </span>
                <span className="text-sm text-gray-600">({posts.length})</span>
              </button>

              <motion.div
                variants={{
                  open: {
                    height: "auto",
                    opacity: 1,
                  },
                  closed: {
                    height: 0,
                    opacity: 0,
                  },
                }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={{
                    open: {
                      filter: "blur(0px)",
                      opacity: 1,
                    },
                    closed: {
                      filter: "blur(2px)",
                      opacity: 0,
                    },
                  }}
                  className="ml-6 mt-2 space-y-1 border-l border-neutral-800 pl-4"
                >
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={getPostUrl(post)}
                      className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1.5"
                    >
                      <span className="text-sm text-gray-500 shrink-0 tabular-nums">
                        {formatDate(post.metadata.date)}
                      </span>
                      <span className="text-gray-200 group-hover:text-accent transition-colors duration-200">
                        {post.metadata.title.toLowerCase()}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </MotionConfig>
  )
}
