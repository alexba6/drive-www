import { useState } from 'react'

export type ModalControl = {
	display: boolean
	show: () => void
	close: () => void
}

export const useModalControl = (): ModalControl => {
	const [display, setDisplay] = useState<boolean>(false)

	const show = () => {
		setDisplay(true)
	}

	const close = () => {
		setDisplay(false)
	}

	return { display, show, close }
}
