import { FunctionComponent, ReactNode } from 'react'

import styles from './ButtonCircle.module.sass'

type ButtonCircleProps = {
	icon: ReactNode
	onClick: () => void
	size?: number
}

export const ButtonCircle: FunctionComponent<ButtonCircleProps> = (props) => {
	return (
		<div className={styles.buttonCircleFrame}>
			<button
				onClick={props.onClick}
				style={{
					height: `${props.size ?? 35}px`,
					width: `${props.size ?? 35}px`,
				}}
			>
				{props.icon}
			</button>
		</div>
	)
}
