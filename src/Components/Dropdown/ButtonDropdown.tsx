import { FunctionComponent, ReactNode } from 'react'

import styles from './ButtonDropdown.module.sass'

type ButtonDropDownProps = {
	icon?: ReactNode
	name: string
	onClick: () => void
}

type ButtonDropDownGroupProps = {
	show: boolean,
	children: ReactNode
}

/**
 *
 * @param props
 * @constructor
 */
const DropdownItem: FunctionComponent<ButtonDropDownProps> = (props) => {
	return (
		<div className={styles.buttonDropdownItemContainer}>
			<button onClick={props.onClick}>
				<div className={styles.buttonDropdownItemInner}>
					<div>
						{props.icon}
					</div>
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
 * @param props
 * @constructor
 */
const DropdownGroup: FunctionComponent<ButtonDropDownGroupProps> = (props) => {
	return (
		<div className={styles.buttonDropDownGroupContainer}>
			{props.show && (
				<div className={styles.buttonDropDownGroup}>
					{props.children}
				</div>
			)}
		</div>
	)
}


export const Dropdown = {
	Group: DropdownGroup,
	Item: DropdownItem
}
