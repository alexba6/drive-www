import {
	AriaAttributes,
	DOMAttributes
} from 'react'

declare module 'react' {
	export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		focus?: any,
		label_position?: any,
		variant?: any,
		error?: any,
		align?: any,
		justify?: any,
		loading?: any,
		size?: any,
		displayMenu?: any,
		active?: any,
		display?: any
	}
}
