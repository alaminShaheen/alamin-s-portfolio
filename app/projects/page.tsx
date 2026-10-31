import { ProjectCard } from "@/components/project-card"
import { PageHeading } from "@/components/page-heading"
import { Metadata } from "next"
import { site } from "@/content/site"

export default function ProjectsPage() {
  return (
    <main className="animate-fade-in-up">
      <PageHeading scramble className="mb-8">projects</PageHeading>

      <p className="text-gray-400 mb-6 leading-relaxed">
        here are some of the projects i&apos;ve worked on. i love building tools
        that make developers&apos; lives easier and exploring new technologies
        along the way.
      </p>

      <div className="space-y-6">
        {site.projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: "Projects",
  description: "Some of the projects I've worked on.",
  openGraph: {
    images: [
      {
        url: "/og/home?title=projects",
      },
    ],
  },
}
