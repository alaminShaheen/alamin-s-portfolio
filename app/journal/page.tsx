import { JournalTree } from "@/components/journal-tree"
import { PageHeading } from "@/components/page-heading"
import { buildJournalTree, getJournalEntries } from "@/lib/journal"
import type { Metadata } from "next"

export default function JournalPage() {
  const tree = buildJournalTree()
  const entries = getJournalEntries()

  return (
    <main>
      <PageHeading scramble className="mb-8">journal</PageHeading>

      <p className="text-gray-400 mb-6 leading-relaxed">
        my learning logs and lab notes. documenting what i learn as i explore
        new technologies, one lab at a time.
      </p>

      {entries.length === 0 ? (
        <p className="text-gray-500">No journal entries yet.</p>
      ) : (
        <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/30">
          <JournalTree tree={tree} />
        </div>
      )}
    </main>
  )
}

export const metadata: Metadata = {
  title: "Journal",
  description: "Learning logs, labs, and notes.",
  openGraph: {
    images: [{ url: "/og/home?title=journal" }],
  },
}
