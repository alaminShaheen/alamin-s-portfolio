import {Header} from "@/components/header"
import {SectionList} from "@/components/section-list"
import {LinksSection} from "@/components/links-section"
import {site} from "@/content/site";
import type {Work} from "@/app/types/Work";

const featuredWorkItems: Work[] = site.work.slice(0, 3)

export default function HomePage() {
	return (
		<>
			<Header/>
			{/*<BlogSection />*/}
			<SectionList
				title="work"
				items={featuredWorkItems}
				viewAllHref="/work"
				viewAllText="all work"
			/>
			<SectionList
				title="projects"
				items={site.projects}
				viewAllHref="/projects"
				viewAllText="all projects"
			/>
			<LinksSection/>
		</>
	)
}
