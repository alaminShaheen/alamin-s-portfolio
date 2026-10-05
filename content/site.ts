// Single source of truth. Everything rendered on this site reads from here —
// nav, header, work, projects, links, metadata, OG images and the RSS feed.
// Components hold layout only; no copy or data is hardcoded in them.

import type {Content} from "@/app/types/Content"

// The one place the deployed origin is configured. Set NEXT_PUBLIC_SITE_URL in
// .env for local work and as a Worker var on Cloudflare for production; every
// absolute URL on the site (RSS, OG images, link previews) derives from it.
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5173";

export const site: Content = {
	name: "alamin shaheen",
	url,
	// SEO copy — meta description, OG description, RSS channel description.
	description: "Developer and software engineer.",
	// Rotating display lines on the homepage.
	descriptions: ["fullstack software engineer at astralform", "building applications with code", "fullstack frontend software engineer", "i love binging and watching anime!"],
	// Shown under your name on the homepage.
	location: "oshawa, ontario, canada",

	bio: "i'm a passionate frontend focused fullstack software engineer from canada with 4.5 years of experience. i'm passionate about web development and software engineering. if i'm not coding, i'm probably playing dota, watching movies or binging anime.",

	// Add { key: "b", label: "blog", href: "/blog" } to put the blog back in the nav.
	nav: [
		{key: "h", label: "home", href: "/"},
		{key: "w", label: "work", href: "/work"},
		{key: "p", label: "projects", href: "/projects"},
	],

	work: [
		{
			title: "astralform",
			role: "software engineer",
			period: "sep 2024 - present",
			description: "building fullstack applications and working on realtime applications",
			href: "https://www.astralforminc.com/",
		},
		{
			title: "astralform",
			role: "software engineer intern",
			period: "may 2024 - sep 2024",
			description: "front-end engineer building accessible, well-tested react systems that let teams ship without waiting on developers",
			href: "https://www.astralforminc.com/",
		},
		{
			title: "ideascale",
			role: "software engineer",
			period: "nov 2021 - aug 2023",
			description: "modernized legacy platforms into fast, type-safe systems, from react front-ends to well-documented express apis",
			href: "https://ideascale.com/",
		},
		{
			title: "astha it",
			role: "software engineer",
			period: "feb 2021 - nov 2021",
			description: "built e-commerce front-ends, with fully tested, accessible react components and secure sslcommerz payment apis.",
			href: "https://ait.inc/",
		},
	],

	projects: [
		{
			title: "preptracker",
			role: "creator",
			technologies: ["typescript", "node.js", "firebase", "sendgrid", "twilio",],
			description:
				"an ai accountability coach for cs students' interview prep, delivering personalized daily insights and reminders on a full-stack next.js, node.js, and firebase build",
			href: "https://github.com/alaminShaheen/PrepTracker",
		},
		{
			title: "banglapay",
			role: "creator",
			technologies: ["typescript", "node.js", "next.js", "google sheets api", "firebase"],
			description: "salary transparency for bangladesh's tech industry: an anonymous, serverless platform where professionals share and explore real pay data",
			href: "https://github.com/alaminShaheen/BanglaPay",
		},
	],

	links: [
		{title: "email", href: "mailto:alaminshaheen23@gmail.com"},
		{title: "github", href: "https://github.com/alaminShaheen"},
		{title: "linkedin", href: "https://www.linkedin.com/in/alaminshaheen/"},
		// { title: "book a call", href: "https://cal.com/yourhandle" },
	],
	navItems: [
		{key: "h", label: "home", href: "/"},
		{key: "b", label: "blog", href: "/blog"},
		{key: "w", label: "work", href: "/work"},
		{key: "p", label: "projects", href: "/projects"},
	]
};
