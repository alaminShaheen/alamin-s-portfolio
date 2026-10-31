import { Posts } from "@/components/posts"
import { PageHeading } from "@/components/page-heading"
import { getPublishedPosts } from "@/lib/blog"
import { Metadata } from "next"

const posts = getPublishedPosts().sort(
  (a, b) =>
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
)

export default async function BlogPage() {
  return (
    <main className="animate-fade-in-up relative">
      <PageHeading scramble className="mb-8">blog</PageHeading>

      <Posts posts={posts} />
    </main>
  )
}

export const metadata: Metadata = {
  title: "Blog",
  description: "Writings on programming, computer science, and more.",
  openGraph: {
    images: [
      {
        url: "/og/home?title=blog",
      },
    ],
  },
}
