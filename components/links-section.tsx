import {site} from "@/content/site"
import Link from "next/link"

export function LinksSection() {
	return (
		<section className="animate-fade-in-up mt-4 pt-10 pb-16 border-t border-neutral-800">
			<h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
				<span className="text-accent accent-glow mr-2">*</span> elsewhere
			</h2>
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
