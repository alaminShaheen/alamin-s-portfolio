import {ReactNode} from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {ScrambleText} from "@/components/scramble-text"

const pageHeadingVariants = cva(
	"font-semibold flex items-center text-white font-incognito",
	{
		variants: {
			size: {
				md: "text-3xl",
				lg: "text-4xl",
			},
			balance: {
				true: "text-balance",
				false: "",
			},
		},
		defaultVariants: {
			size: "lg",
			balance: false,
		},
	}
)

type PageHeadingProps = {
	children: ReactNode
	className?: string
	scramble?: boolean
} & VariantProps<typeof pageHeadingVariants>

export function PageHeading(props: PageHeadingProps) {
	const {children, size, balance, className, scramble = false} = props
	return (
		<h1 className={pageHeadingVariants({size, balance, className})}>
			<span className="text-accent accent-glow mr-2 font-mono">*</span>
			{scramble && typeof children === "string" ? (
				<ScrambleText text={children} />
			) : (
				children
			)}
		</h1>
	)
}
