import React, { SVGProps } from 'react'

export function MdiImage(props: SVGProps<SVGSVGElement>) {
	return (
		<svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
			<path
				d="M8.5 13.5l2.5 3l3.5-4.5l4.5 6H5m16 1V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"
				fill="currentColor"
			></path>
		</svg>
	)
}
export default MdiImage
