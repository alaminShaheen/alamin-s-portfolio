import {ReactNode} from "react"
import {cva, type VariantProps} from "class-variance-authority"

const sectionHeadingVariants = cva(
	"font-semibold flex items-center text-white font-incognito",
	{
		variants: {
			size: {
				sm: "text-xl",
				md: "text-2xl",
				lg: "text-3xl",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
)

type SectionHeadingProps = {
	children: ReactNode
	className?: string
} & VariantProps<typeof sectionHeadingVariants>

export function SectionHeading(props: SectionHeadingProps) {
	const {children, size, className} = props
	return (
		<h2 className={sectionHeadingVariants({size, className})}>
			<span className="text-accent accent-glow mr-2 font-mono">*</span>
			{children}
		</h2>
	)
}
