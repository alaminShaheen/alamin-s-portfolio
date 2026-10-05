"use client"

import {ScrambleText} from "@/components/scramble-text"
import {site} from "@/content/site"
import {useRef} from "react";
import {useInView, usePageInView} from "framer-motion";
import {TextFlip} from "@/components/text-flip";
import {motion} from "motion/react";
import {MapPinHouse} from "lucide-react";

// The font is monospace, so 1ch is exactly one glyph: reserving the longest
// line's character count holds the box steady as the shorter lines cycle
// through. Derived from the data, so it stays correct when you edit
// site.descriptions.
const flipWidth = `${Math.max(...site.descriptions.map((d) => d.length))}ch`

export function Header() {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref);
	const isPageInView = usePageInView();

	return (
		<header className="mb-16 space-y-4">
			<h1 className="text-5xl font-semibold tracking-tight text-white text-balance mb-4 animate-fade-in">
				<span className="inline-block">
				  <ScrambleText text={site.name.toLowerCase()}/>
				</span>
			</h1>
			<p className="text-gray-500 animate-fade-in flex flex-col gap-2">
				<span ref={ref} className="inline-block" style={{minWidth: flipWidth}}>
					<TextFlip as={motion.span} interval={3} play={isInView && isPageInView}>
						{site.descriptions}
					</TextFlip>
				</span>
				<span className="inline-flex gap-2">
					<MapPinHouse size={18} /> {site.location}
				</span>
			</p>
			<p className="text-pretty max-w-[52ch] animate-fade-in-up">
				{site.bio}
			</p>
		</header>
	)
}
