import { FunctionComponent, useMemo, useState } from 'react'

import MdiChevronRight from '../../Icons/MdiChevronRight'
import MdiDotsHorizontal from '../../Icons/MdiDotsHorizontal'
import { ButtonCircle } from '../Button/ButtonCircle'
import MdiChevronDown from '../../Icons/MdiChevronDown'
import MdiFolder from '../../Icons/MdiFolder'
import { ButtonDropDown, ButtonDropDownGroup, HrDropDown } from '../Button/ButtonDropDown'
import MdiFolderPlusOutline from '../../Icons/MdiFolderPlusOutline'
import MdiFileUploadOutline from '../../Icons/MdiFileUploadOutline'
import MdiFolderUploadOutline from '../../Icons/MdiFolderUploadOutline'
import {DriveFolder} from "../../Store/Drive/DriveReducer";

import styles from './TreeFolderView.module.sass'

type TreeFolderViewProps = {
	rootName: string
	folders: DriveFolder[]
	onClickRoot: () => void
	onClick: (folder: DriveFolder) => void
	onAddFolder: (parentFolder: DriveFolder) => void
	onUploadFiles: (parentFolder: DriveFolder) => void
}

type FolderComponentProps = {
	folderName: DriveFolder['name']
	last: boolean
	onClick: () => void
	onAddFolder: () => void
	onUploadFiles: () => void
}

type MiddleFoldersComponentProps = {
	folders: DriveFolder[]
	onClick: (folder: DriveFolder) => void
}

/**
 *
 * @param props
 * @constructor
 */
const FolderComponent: FunctionComponent<FolderComponentProps> = (props) => {
	const [display, setDisplay] = useState(false)

	const handleClick = (callback: Function) => () => {
		setDisplay(false)
		callback()
	}

	return (
		<div className={styles.lastFolderContainer}>
			<button onClick={props.last ? () => setDisplay((d) => !d) : props.onClick}>
				<div className={styles.folderFrame}>
					<div>
						<span>{props.folderName}</span>
					</div>
					{props.last ? <MdiChevronDown /> : <MdiChevronRight />}
				</div>
			</button>
			{props.last && (
				<ButtonDropDownGroup
					width={300}
					left={window.innerWidth < 500 ? -150 : undefined}
					show={display}
					items={[
						<ButtonDropDown
							key={'Add folder'}
							icon={<MdiFolderPlusOutline />}
							name={'Dossier'}
							onClick={handleClick(props.onAddFolder)}
						/>,
						<HrDropDown />,
						<ButtonDropDown
							key={'Add folder'}
							icon={<MdiFileUploadOutline />}
							name={'Importer des fichiers'}
							onClick={handleClick(props.onUploadFiles)}
						/>,
						<ButtonDropDown
							key={'Add folder'}
							icon={<MdiFolderUploadOutline />}
							name={'Importer un dossier'}
							onClick={() => {}}
						/>,
					]}
				/>
			)}
		</div>
	)
}

/**
 *
 * @param props
 * @constructor
 */
const MiddleFolderComponent: FunctionComponent<MiddleFoldersComponentProps> = (props) => {
	const [display, setDisplay] = useState(false)

	return (
		<div>
			<div className={styles.middleFoldersFrame}>
				<ButtonCircle icon={<MdiDotsHorizontal fontSize={20} />} size={35} onClick={() => setDisplay((d) => !d)} />
				<MdiChevronRight />
			</div>
			<ButtonDropDownGroup
				show={display}
				items={props.folders.map((folder, key) => (
					<ButtonDropDown key={key} icon={<MdiFolder />} name={folder.name} onClick={() => props.onClick(folder)} />
				))}
			/>
		</div>
	)
}

/**
 *
 * @param props
 * @constructor
 */
export const TreeFolderView: FunctionComponent<TreeFolderViewProps> = (props) => {
	const [middleFolders, folders] = useMemo(() => {
		const len = props.folders.length
		if (len < 3) {
			return [undefined, props.folders]
		}
		return [props.folders.slice(0, len - 2), props.folders.slice(len - 2, len)]
	}, [props.folders])

	return (
		<div className={styles.rootFolderViewContainer}>
			<FolderComponent
				folderName={props.rootName}
				last={props.folders.length === 0}
				onClick={props.onClickRoot}
				onAddFolder={() => {}}
				onUploadFiles={() => {}}
			/>
			{middleFolders && <MiddleFolderComponent folders={middleFolders} onClick={props.onClick} />}
			{folders.map((folder, i) => (
				<FolderComponent
					key={i}
					last={i + 1 === folders.length}
					folderName={folder.name}
					onClick={() => props.onClick(folder)}
					onAddFolder={() => props.onAddFolder(folder)}
					onUploadFiles={() => props.onUploadFiles(folder)}
				/>
			))}
		</div>
	)
}
