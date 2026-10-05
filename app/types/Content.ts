import {Work} from "@/app/types/Work";
import {Project} from "@/app/types/Project";

export type SiteLink = {
	title: string;
	href: string;
}

/** `key` is the single-press keyboard shortcut handled in components/navbar.tsx. */
export type NavItem = {
	key: string;
	label: string;
	href: string;
}

export type Content = {
	name: string;
	url: string;
	/** Single-sentence SEO copy: <meta name="description">, OG, and the RSS
	 *  channel description. Not display copy — see `descriptions`. */
	description: string;
	/** Rotating display lines on the homepage. */
	descriptions: string[];
	/** Shown under your name and beside description on the homepage. */
	location: string;
	/** "@handle" for twitter:creator. Omit the field to drop the tag. */
	twitter?: string;
	bio: string;
	nav: NavItem[];
	work: Work[];
	projects: Project[];
	links: SiteLink[];
	navItems: NavItem[];
}
