import { FunctionComponent, ReactNode } from 'react'

import styles from './NavigationBarLink.module.sass'
import { useHistory, useLocation } from 'react-router-dom'

type NavigationBarLinkProps = {
	icon: ReactNode
	name: string
	target: string
}

export const NavigationBarLink: FunctionComponent<NavigationBarLinkProps> = (props) => {
	const history = useHistory()
	const location = useLocation()

	const redirect = () => history.push(props.target)

	return (
		<div
			className={
				props.target === location.pathname ? styles.navigationBarLinkFrameSelected : styles.navigationBarLinkFrame
			}
			onClick={redirect}
		>
			<div className={styles.navigationBarIcon}>{props.icon}</div>
			<div>
				<span>{props.name}</span>
			</div>
		</div>
	)
}
