import { FunctionComponent, ReactNode } from 'react'

import styles from './ButtonDropDown.module.sass'

type ButtonDropDownProps = {
	icon: ReactNode
	name: string
	onClick: () => void
}

type ButtonDropDownGroupProps = {
	items: ReturnType<FunctionComponent>[]
	width?: number
	bottom?: number
	left?: number
	show: boolean
}

/**
 *
 * @param props
 * @constructor
 */
export const ButtonDropDown: FunctionComponent<ButtonDropDownProps> = (props) => {
	return (
		<div className={styles.buttonDropDownContainer}>
			<button onClick={props.onClick}>
				<div className={styles.buttonDropDownInner}>
					{props.icon}
					<div>
						<span>{props.name}</span>
					</div>
				</div>
			</button>
		</div>
	)
}
/**
 *
 * @constructor
 */
export const HrDropDown: FunctionComponent = () => {
	return <div className={styles.hrFrame} />
}

/**
 *
 * @param props
 * @constructor
 */
export const ButtonDropDownGroup: FunctionComponent<ButtonDropDownGroupProps> = (props) => {
	return (
		<div className={styles.buttonDropDownGroupContainer}>
			{props.show && (
				<div
					className={styles.buttonDropDownGroup}
					style={{
						width: props.width ? `${props.width}px` : 'auto',
						bottom: `${props.bottom ?? -1}px`,
						left: `${props.left ?? 0}px`,
					}}
				>
					{props.items.map((item) => item)}
				</div>
			)}
		</div>
	)
}
