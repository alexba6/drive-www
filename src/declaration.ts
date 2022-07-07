import {
	AriaAttributes,
	DOMAttributes
} from 'react'

declare module 'react' {
	export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		focus?: any,
		labelPosition?: any,
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
