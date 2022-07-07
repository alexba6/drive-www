import { FunctionComponent } from 'react'
import { IconNew } from '../../Icons/IconNew'

import styles from './ButtonNew.module.sass'

type ButtonNewProps = {
	onClick: () => void
}

export const ButtonNew: FunctionComponent<ButtonNewProps> = (props) => {
	return (
		<button className={styles.buttonNew} onClick={props.onClick}>
			<div className={styles.buttonNewInsideFrame}>
				<div className={styles.buttonNewInsideIconFrame}>
					<IconNew />
				</div>
				<div className={styles.buttonNewInsideTextFrame}>
					<span>Nouveau</span>
				</div>
			</div>
		</button>
	)
}
