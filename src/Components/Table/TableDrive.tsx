import {FunctionComponent, MouseEvent, useState, useCallback, useMemo, useEffect} from 'react'
import moment from 'moment'

import MdiFolder from '../../Icons/MdiFolder'
import { FileIcon } from '../File/FileIcon'
import { getFileMultipleSize } from '../../Tools/File'
import {DriveFile, DriveFolder} from "../../Store/Drive/DriveReducer";
import {useClick} from "../../hooks/UseClick";

import styles from './TableDrive.module.sass'
import {usePressedKey} from "../../hooks/UsePressedKey";
import {ClickOutsideWrapper} from "../../Wrapper/ClikOutside";

type TableFileFolderProps = {
	folders: DriveFolder[]
	files: DriveFile[]
	onOpenFolder: (folder: DriveFolder) => void
	onDownloadFile: (file: DriveFile) => void
}

type FolderRowProps = {
	folder: DriveFolder
	active: boolean
	onClick: () => void
	onContextMenu: (event: MouseEvent<HTMLTableRowElement>) => void,
	onOpenFolder: () => void
}

type FileRowProps = {
	file: DriveFile
	active: boolean
	onClick: () => void
	onContextMenu: (event: MouseEvent<HTMLTableRowElement>) => void
}

/**
 * @param props
 * @constructor
 */
const FileRow: FunctionComponent<FileRowProps> = (props) => {
	return (
		<tr
			className={styles.tableDriveRowContainer}
			onContextMenu={props.onContextMenu}
			onClick={props.onClick}
			active={props.active ? 'active' : ''}>
			<td>
				<div className={styles.tableDriveRowNameCellFrame}>
					<FileIcon file={props.file}/>
					<span>
						{props.file.name.slice(0, 40)}{props.file.name.length > 40 && '...'}.{props.file.ext}
					</span>
				</div>
			</td>
			<td>
				<span>{moment(props.file.updatedAt).calendar()}</span>
			</td>
			<td>
				<span>{getFileMultipleSize(props.file.size)}</span>
			</td>
		</tr>
	)
}

/**
 * @param props
 * @constructor
 */
const FolderRow: FunctionComponent<FolderRowProps> = (props) => {
	const click = useClick({ count: 2, time: 250 })

	click.onClick(props.onOpenFolder)

	const handleClick = () => {
		click.click()
		props.onClick()
	}

	return (
		<tr
			className={styles.tableDriveRowContainer}
			onContextMenu={props.onContextMenu}
			onClick={handleClick}
			active={props.active ? 'active' : ''}>
			<td>
				<div className={styles.tableDriveRowNameCellFrame}>
					<MdiFolder />
					<div>
						<span>{props.folder.name}</span>
					</div>
				</div>
			</td>
			<td> { moment(props.folder.updatedAt).calendar() } </td>
			<td> - </td>
		</tr>
	)
}

/**
 * @param props
 * @constructor
 */
export const TableDrive: FunctionComponent<TableFileFolderProps> = (props) => {
	const {folders, files} = props
	const [activeFolders, setActiveFolders] = useState<DriveFolder[]>([])
	const [activeFiles, setActiveFiles] = useState<DriveFile[]>([])

	const pressedKey = usePressedKey('Control', 'Escape', 'Shift')

	const cleanActive = useCallback(() => {
		setActiveFolders([])
		setActiveFiles([])
	}, [])

	pressedKey.onKeyDown('Escape', cleanActive)

	/**
	 * @param folder
	 */
	const onClickFolder = (folder: DriveFolder) => {
		if (pressedKey.has('Control')) {
			setActiveFolders(state => {
				if (state.find(activeFolder => activeFolder.id === folder.id)) {
					return state.filter(activeFolder => activeFolder.id !== folder.id)
				}
				return [...state, folder]
			})
		} else {
			setActiveFolders([folder])
			setActiveFiles([])
		}
	}

	/**
	 * @param file
	 */
	const onClickFile = (file: DriveFile) => {
		if (pressedKey.has('Control')) {
			setActiveFiles(state => {
				if (state.find(activeFile => activeFile.id === file.id)) {
					return state.filter(activeFile => activeFile.id !== file.id)
				}
				return [...state, file]
			})
		} else {
			setActiveFiles([file])
			setActiveFolders([])
		}
	}


	return (
		<ClickOutsideWrapper onClickOutside={cleanActive}>
			<div className={styles.tableDriveContainer}>
				<table>
					<thead>
					<tr>
						<td>Nom</td>
						<td>Dernière modification</td>
						<td>Taille du fichier</td>
					</tr>
					</thead>
					<tbody>
					{folders.map((folder: DriveFolder, i: number) => <FolderRow
						key={i}
						onClick={() => onClickFolder(folder)}
						onOpenFolder={() => props.onOpenFolder(folder)}
						folder={folder}
						onContextMenu={(event: MouseEvent<HTMLTableRowElement>) => {}}
						active={!!activeFolders.find(activeFolder => activeFolder.id === folder.id)}
					/>)}
					{files.map((file: DriveFile, i: number) => <FileRow
						key={i + props.folders.length}
						onClick={() =>  onClickFile(file)}
						file={file}
						onContextMenu={(event: MouseEvent<HTMLTableRowElement>) => {}}
						active={!!activeFiles.find(activeFile => activeFile.id === file.id)}
					/>)}
					</tbody>
				</table>
			</div>
		</ClickOutsideWrapper>
	)
}
