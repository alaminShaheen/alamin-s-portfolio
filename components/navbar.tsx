"use client"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useEffect} from "react"
import {site} from "@/content/site"

export function Navbar() {
	const router = useRouter()

	// Single-press shortcuts, one per entry in site.nav.
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			// Don't trigger if any input elements are focused or if event target is an input
			if (
				document.activeElement?.tagName === "INPUT" ||
				document.activeElement?.tagName === "TEXTAREA" ||
				event.target instanceof HTMLInputElement
			) {
				return
			}

			if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) {
				return
			}

			const key = event.key.toLowerCase()
			const match = site.nav.find((entry) => entry.key === key)
			if (match) {
				router.push(match.href)
			}
		}

		window.addEventListener("keydown", handleKeyPress)
		return () => window.removeEventListener("keydown", handleKeyPress)
	}, [router])

	return (
		<nav className="flex items-center justify-between mb-12 text-sm">
			<div className="flex space-x-1 sm:space-x-4">
				{site.nav.map((entry) => (
					<Link
						key={entry.href}
						href={entry.href}
						className="hover:text-accent transition-colors duration-200 py-2 px-1.5 sm:px-0 sm:py-0"
					>
						<span className="hidden sm:inline">{`[${entry.key}] `}</span>
						{entry.label}
					</Link>
				))}
			</div>
		</nav>
	)
}
