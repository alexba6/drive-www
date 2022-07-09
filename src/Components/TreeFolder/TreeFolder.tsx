import { FunctionComponent, useMemo, useState } from 'react'

import MdiChevronRight from '../../Icons/MdiChevronRight'
import MdiDotsHorizontal from '../../Icons/MdiDotsHorizontal'
import { ButtonCircle } from '../Button/ButtonCircle'
import MdiChevronDown from '../../Icons/MdiChevronDown'
import MdiFolder from '../../Icons/MdiFolder'
import {DriveFolder} from "../../Store/Drive/DriveReducer";
import {Dropdown} from "../Dropdown/ButtonDropdown";
import MdiFileUploadOutline from "../../Icons/MdiFileUploadOutline";
import MdiFolderUploadOutline from "../../Icons/MdiFolderUploadOutline";
import MdiFolderPlusOutline from "../../Icons/MdiFolderPlusOutline";
import {ClickOutsideWrapper} from "../../Wrapper/ClikOutside";


import styles from './TreeFolder.module.sass'

type TreeFolderViewProps = {
	rootName: string
	folders: DriveFolder[]
	onClickRoot: () => void
	onClick: (folder: DriveFolder) => void
	onAddFolder: () => void
	onUploadFiles: (parentFolder: DriveFolder) => void
	pending: boolean
}

type TreeFolderItemProps = {
	folderName: DriveFolder['name']
	last: boolean
	onClick: () => void
	onAddFolder: () => void
	onUploadFiles: () => void
}

type TreeFolderMiddleProps = {
	folders: DriveFolder[]
	onClick: (folder: DriveFolder) => void
}

/**
 *
 * @param props
 * @constructor
 */
const TreeFolderItem: FunctionComponent<TreeFolderItemProps> = (props) => {
	const [display, setDisplay] = useState(false)

	const handleClick = (callback: Function) => () => {
		setDisplay(false)
		callback()
	}

	return (
		<ClickOutsideWrapper onClickOutside={() => setDisplay(false)}>
			<div className={styles.treeFolderItemContainer}>
				<button onClick={props.last ? () => setDisplay((d) => !d) : props.onClick}>
					<div className={styles.treeFolderItemFrame}>
						<div>
							<span>{props.folderName}</span>
						</div>
						{props.last ? <MdiChevronDown /> : <MdiChevronRight />}
					</div>
				</button>
				{props.last && <Dropdown.Group show={display}>
					<Dropdown.Item
						icon={<MdiFolderPlusOutline />}
						name={'Dossier'}
						onClick={handleClick(props.onAddFolder)}
					/>
					<Dropdown.Item
						icon={<MdiFileUploadOutline />}
						name={'Importer des fichiers'}
						onClick={handleClick(props.onUploadFiles)}
					/>
					<Dropdown.Item
						icon={<MdiFolderUploadOutline />}
						name={'Importer un dossier'}
						onClick={() => {}}
					/>
				</Dropdown.Group>}
			</div>
		</ClickOutsideWrapper>
	)
}

/**
 *
 * @param props
 * @constructor
 */
const TreeFolderMiddle: FunctionComponent<TreeFolderMiddleProps> = (props) => {
	const [display, setDisplay] = useState(false)

	const toggle = () => setDisplay((state: boolean) => !state)

	return (
		<ClickOutsideWrapper onClickOutside={() => setDisplay(false)}>
			<div className={styles.treeFolderMiddle}>
				<ButtonCircle
					icon={<MdiDotsHorizontal fontSize={20}/>}
					size={35}
					onClick={toggle}
				/>
				<MdiChevronRight />
			</div>
			<Dropdown.Group show={display}>
				{props.folders.map((folder: DriveFolder) => <Dropdown.Item
					key={'m' + folder.id}
					icon={<MdiFolder />}
					name={`${folder.name.slice(0, 15)}${folder.name.length > 15 ? '...' : ''}`}
					onClick={() => props.onClick(folder)}
				/>)}
			</Dropdown.Group>
		</ClickOutsideWrapper>
	)
}

/**
 *
 * @param props
 * @constructor
 */
export const TreeFolder: FunctionComponent<TreeFolderViewProps> = (props) => {
	const [middleFolders, folders] = useMemo(() => {
		const len = props.folders.length
		if (len < 4) {
			return [undefined, props.folders]
		}
		return [props.folders.slice(0, len - 2), props.folders.slice(len - 2, len)]
	}, [props.folders])

	return (
		<div className={styles.treeFolderContainer}>
			<TreeFolderItem
				folderName={props.rootName}
				last={props.folders.length === 0}
				onClick={props.onClickRoot}
				onAddFolder={props.onAddFolder}
				onUploadFiles={() => {}}
			/>
			{middleFolders && <TreeFolderMiddle folders={middleFolders} onClick={props.onClick} />}
			{folders.map((folder: DriveFolder, index: number) => <TreeFolderItem
				key={'t' + folder.id}
				last={index + 1 === folders.length}
				folderName={folder.name}
				onClick={() => props.onClick(folder)}
				onAddFolder={props.onAddFolder}
				onUploadFiles={() => props.onUploadFiles(folder)}
			/>)}
		</div>
	)
}
