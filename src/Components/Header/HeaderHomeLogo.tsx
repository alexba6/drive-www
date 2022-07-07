import { FunctionComponent } from 'react'

import styles from './HeaderHomeLogo.module.sass'
import DriveLogo from '../../Img/drive.png'

export type HeaderHomeLogoProps = {
	onClick?: () => void
}

export const HeaderHomeLogo: FunctionComponent<HeaderHomeLogoProps> = (props) => {
	return (
		<div className={styles.headerHomeLogo} onClick={props.onClick}>
			<div>
				<img src={DriveLogo} alt="Drive logo" />
			</div>
			<div>
				<span>Drive</span>
			</div>
		</div>
	)
}
