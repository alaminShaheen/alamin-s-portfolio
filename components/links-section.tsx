import {site} from "@/content/site"
import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"

export function LinksSection() {
	return (
		<section className="animate-fade-in-up mt-4 pt-10 pb-16 border-t border-neutral-800">
			<SectionHeading size="md" className="mb-6">elsewhere</SectionHeading>
			<div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
				{site.links.map((link, index) => (
					<Link
						key={index}
						href={link.href}
						className="text-gray-500 hover:text-accent transition-colors duration-200"
					>
						{link.title}
					</Link>
				))}
			</div>
		</section>
	)
}
