import Link from "next/link"
import {ArrowBigLeft} from "lucide-react"
import {ReactNode} from "react";

type BackLinkProps = {
	href: string
	children: ReactNode
}

export function BackLink({href, children}: BackLinkProps) {
	return (
		<Link
			href={href}
			className="text-sm text-gray-500 hover:text-accent transition-colors duration-200 inline-flex items-center gap-2"
		>
			<ArrowBigLeft className="w-4 h-4"/>
			{children}
		</Link>
	)
}
