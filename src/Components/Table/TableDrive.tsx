import {FunctionComponent, MouseEvent, useState, useCallback} from 'react'
import moment from 'moment'

import MdiFolder from '../../Icons/MdiFolder'
import { FileIcon } from '../File/FileIcon'
import { getFileMultipleSize } from '../../Tools/File'
import {DriveFile, DriveFolder} from "../../Store/Drive/DriveReducer";
import {ClickOutsideWrapper} from "../../Wrapper/ClikOutside";
import {useClick} from "../../hooks/UseClick";
import {usePressedKey} from "../../hooks/UsePressedKey";
import {Dropdown} from "../Dropdown/ButtonDropdown";
import {useFloatBox} from "../../hooks/UseFloatBox";
import {BoxFloat} from "../Box/BoxFloat";

import styles from './TableDrive.module.sass'
import MdiDownload from "../../Icons/MdiDownload";
import MdiPencilOutline from "../../Icons/MdiPencilOutline";

type TableFileFolderProps = {
	folders: DriveFolder[]
	files: DriveFile[]
	onOpenFolder: (folder: DriveFolder) => void
	onDownloadFile: (file: DriveFile) => void
	onRenameFolder: (folder: DriveFolder) => void
	onRenameFile: (file: DriveFile) => void
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

type ItemFile = {
	type: 'file'
	file: DriveFile
}

type ItemFolder = {
	type: 'folder'
	folder: DriveFolder
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
					<MdiFolder/>
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
	const [startShiftItem, setStartShiftItem] = useState<ItemFile | ItemFolder | null>(null)
	const [activeFolders, setActiveFolders] = useState<DriveFolder[]>([])
	const [activeFiles, setActiveFiles] = useState<DriveFile[]>([])

	const fileFloatBox = useFloatBox()
	const folderFlotBox = useFloatBox()
	const manyFloatBox = useFloatBox()

	const pressedKey = usePressedKey('Control', 'Escape', 'Shift')

	const cleanFloatBox = useCallback(() => {
		fileFloatBox.hide()
		folderFlotBox.hide()
		manyFloatBox.hide()
	}, [fileFloatBox, folderFlotBox, manyFloatBox])

	const cleanActive = useCallback(() => {
		setActiveFolders([])
		setActiveFiles([])
		setStartShiftItem(null)
		cleanFloatBox()
	}, [fileFloatBox])

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
			setStartShiftItem({
				type: 'folder', folder
			})
		} else if (pressedKey.has('Shift') && startShiftItem) {
			if (startShiftItem.type === 'folder') {
				const start = props.folders.indexOf(startShiftItem.folder)
				const end = props.folders.indexOf(folder)
				if (end > start) {
					setActiveFolders([startShiftItem.folder, ...props.folders.slice(start, end + 1)])
				} else {
					setActiveFolders([startShiftItem.folder, ...props.folders.slice(end, start)])
				}
				setActiveFiles([])
			} else {
				const start = props.folders.indexOf(folder)
				setActiveFolders(props.folders.slice(start, props.folders.length))

				const end = props.files.indexOf(startShiftItem.file)
				setActiveFiles(props.files.slice(0, end + 1))
			}
		} else {
			setActiveFolders([folder])
			setActiveFiles([])
			setStartShiftItem({
				type: 'folder', folder
			})
		}
		cleanFloatBox()
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
			setStartShiftItem({
				type: 'file', file
			})
		} else if (pressedKey.has('Shift') && startShiftItem) {
			if (startShiftItem.type === 'file') {
				const start = props.files.indexOf(startShiftItem.file)
				const end = props.files.indexOf(file)
				if (end > start) {
					setActiveFiles([startShiftItem.file, ...props.files.slice(start, end + 1)])
				} else {
					setActiveFiles([startShiftItem.file, ...props.files.slice(end, start)])
				}
				setActiveFolders([])
			} else {
				const start = props.folders.indexOf(startShiftItem.folder)
				setActiveFolders(props.folders.slice(start, props.folders.length))

				const end = props.files.indexOf(file)
				setActiveFiles(props.files.slice(0, end + 1))
			}
		} else {
			setActiveFiles([file])
			setActiveFolders([])
			setStartShiftItem({
				type: 'file', file
			})
		}
		cleanFloatBox()
	}

	/**
	 * @param event
	 * @param folder
	 */
	const onContextMenuFolder = (event: MouseEvent<HTMLTableRowElement>, folder: DriveFolder) => {
		event.preventDefault()
		cleanFloatBox()
		const position = { x: event.clientX, y: event.clientY }
		if (activeFolders.indexOf(folder) === -1 || (activeFiles.length === 0 && activeFolders.length === 1)) {
			setActiveFolders([folder])
			setActiveFiles([])
			folderFlotBox.show(position)
		} else {
			manyFloatBox.show(position)
		}
	}

	/**
	 * @param event
	 * @param file
	 */
	const onContextMenuFile = (event: MouseEvent<HTMLTableRowElement>, file: DriveFile) => {
		event.preventDefault()
		cleanFloatBox()
		const position = { x: event.clientX, y: event.clientY }
		if (activeFiles.indexOf(file) === -1 || (activeFiles.length === 1 && activeFolders.length === 0)) {
			setActiveFiles([file])
			setActiveFolders([])
			fileFloatBox.show(position)
		} else {
			manyFloatBox.show(position)
		}
	}

	const handleAction = (callback: Function) => () => {
		cleanActive()
		callback()
	}

	return (
		<ClickOutsideWrapper onClickOutside={cleanActive}>
			<BoxFloat display={folderFlotBox.display} position={folderFlotBox.position} width={100} height={100}>
				<Dropdown.Group show={true}>
					<Dropdown.Item
						icon={<MdiPencilOutline/>}
						name='Renommer'
						onClick={handleAction(() => props.onRenameFolder(activeFolders[0]))}
					/>
				</Dropdown.Group>
			</BoxFloat>
			<BoxFloat display={fileFloatBox.display} position={fileFloatBox.position} width={100} height={100}>
				<Dropdown.Group show={true}>
					<Dropdown.Item
						icon={<MdiDownload/>}
						name='Download'
						onClick={handleAction(() => props.onDownloadFile(activeFiles[0]))}
					/>
					<Dropdown.Item
						icon={<MdiPencilOutline/>}
						name='Renommer'
						onClick={handleAction(() => props.onRenameFile(activeFiles[0]))}
					/>
				</Dropdown.Group>
			</BoxFloat>


			<BoxFloat display={manyFloatBox.display} position={manyFloatBox.position} width={100} height={100}>
				<Dropdown.Group show={true}>
					<Dropdown.Item name='many' onClick={() => {}}/>
				</Dropdown.Group>
			</BoxFloat>
			<div className={styles.tableDriveContainer}>
				<table>
					<thead>
					<tr>
						<td>Nom</td>
						<td>Derni??re modification</td>
						<td>Taille du fichier</td>
					</tr>
					</thead>
					<tbody>
					{folders.map((folder: DriveFolder, i: number) => <FolderRow
						key={i}
						onClick={() => onClickFolder(folder)}
						onOpenFolder={() => props.onOpenFolder(folder)}
						folder={folder}
						onContextMenu={event => onContextMenuFolder(event, folder)}
						active={!!activeFolders.find(activeFolder => activeFolder.id === folder.id)}
					/>)}
					{files.map((file: DriveFile, i: number) => <FileRow
						key={i + props.folders.length}
						onClick={() =>  onClickFile(file)}
						file={file}
						onContextMenu={event => onContextMenuFile(event, file)}
						active={!!activeFiles.find(activeFile => activeFile.id === file.id)}
					/>)}
					</tbody>
				</table>
			</div>
		</ClickOutsideWrapper>
	)
}
