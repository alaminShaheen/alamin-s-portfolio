// Field names match <SectionList> and <ProjectCard>, which both read
// `title` / `description`, and match the data in content/site.ts.
export type Project = {
	title: string;
	role: string;
	description: string;
	href: string;
	technologies: string[];
	/** Optional — <ProjectCard> declares it but doesn't render it yet. */
	achievements?: string[];
	period?: string;
}
