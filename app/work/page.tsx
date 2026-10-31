import { SectionList } from "@/components/section-list"
import { PageHeading } from "@/components/page-heading"
import { workItems } from "@/lib/work-items"
import { Metadata } from "next"

export default function WorkPage() {
  return (
    <main className="animate-fade-in-up">
      <PageHeading scramble className="mb-8">work</PageHeading>

      <p className="text-gray-400 mb-6 leading-relaxed">
        here&apos;s where i&apos;ve worked and the kind of products i helped ship.
      </p>

      <SectionList title="work" items={workItems} showTitle={false} showSectionBorder={false} />
    </main>
  )
}

export const metadata: Metadata = {
  title: "Work",
  description: "Places I've worked and what I built.",
  openGraph: {
    images: [
      {
        url: "/og/home?title=work",
      },
    ],
  },
}
