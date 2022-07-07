import { FunctionComponent } from 'react'
import { getFileMultipleSize } from '../../Tools/File'

import styles from './StatDiskUse.module.sass'

type StatDiskUseProps = {
	maxAllowed: number
	currentUse: number
}

export const StatDiskUse: FunctionComponent<StatDiskUseProps> = (props) => {
	return (
		<div className={styles.statContainer}>
			<div className={styles.statBarContainer}>
				<div
					className={styles.statBarProgress}
					style={{
						width: `${Math.floor((props.currentUse * 100) / props.maxAllowed)}%`,
					}}
				/>
			</div>
			<div>
				<span>
					{getFileMultipleSize(props.currentUse)} utilisés sur {getFileMultipleSize(props.maxAllowed)}
				</span>
			</div>
		</div>
	)
}
