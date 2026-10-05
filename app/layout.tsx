import type {Metadata} from "next"
import {JetBrains_Mono} from "next/font/google"
import "./globals.css"
import {Navbar} from "../components/navbar"
import {site} from "@/content/site"

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
	// Every relative URL below (and in every page's metadata) is resolved
	// against this, so the site works on localhost, *.workers.dev and a custom
	// domain without touching a single hardcoded link.
	metadataBase: new URL(site.url),
	title: {
		default: site.name,
		template: `%s | ${site.name}`,
	},
	description: site.description,
	openGraph: {
		title: site.name,
		description: site.description,
		url: "/",
		siteName: site.name,
		locale: "en_US",
		type: "website",
		images: ["/og/home"],
	},
	robots: {
		index: true,
		follow: true,
		"max-video-preview": -1,
		"max-image-preview": "large",
		"max-snippet": -1,
	},
}

export default function RootLayout({
									   children,
								   }: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
		<body
			className={`${jetbrainsMono.variable} antialiased min-h-screen font-mono`}
		>
		<div className="max-w-4xl mx-auto px-5 sm:px-4 py-8">
			<Navbar/>
			{children}
		</div>
		</body>
		</html>
	)
}
