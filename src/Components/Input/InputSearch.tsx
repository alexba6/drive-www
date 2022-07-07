import { FunctionComponent, useState } from 'react'
import { ButtonCircle } from '../Button/ButtonCircle'
import TeenyiconsAdjustHorizontalOutline from '../../Icons/TeenyiconsAdjustHorizontalOutline'
import IcRoundSearch from '../../Icons/IcRoundSearch'
import IcRoundClose from '../../Icons/IcRoundClose'

import styles from './InputSearch.module.sass'

export const InputSearch: FunctionComponent = () => {
	const [search, setSearch] = useState<string>(String())

	const clearSearch = () => setSearch(String())

	return (
		<div className={styles.inputSearchFrame}>
			<div>
				<ButtonCircle icon={<IcRoundSearch fontSize={25} />} size={35} onClick={() => {}} />
			</div>
			<div className={styles.inputSearch}>
				<input placeholder="Rechercher dans Drive" value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>
			<div className={styles.inputSearchCrossFrame}>
				{search.length > 0 && <ButtonCircle icon={<IcRoundClose fontSize={20} />} size={35} onClick={clearSearch} />}
			</div>
			<div>
				<ButtonCircle icon={<TeenyiconsAdjustHorizontalOutline fontSize={20} />} size={35} onClick={() => {}} />
			</div>
		</div>
	)
}
