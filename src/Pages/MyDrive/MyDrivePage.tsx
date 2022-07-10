import React, {FunctionComponent, useEffect, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from "@reduxjs/toolkit";
import {toast} from "react-toastify";

import {Template} from '../../Template/Template'
import {ButtonNew} from '../../Components/Button/ButtonNew'
import {TableDrive} from '../../Components/Table/TableDrive'
import {TreeFolder} from "../../Components/TreeFolder/TreeFolder";
import {Spinner} from "../../Components/Spinner/Spinner";
import {ModalInput} from "../../Components/Modal/ModalInput";

import {useModal} from "../../hooks/UseModal";
import {AuthenticationKey} from '../../Context/ContextAuthentication'
import {DriveFile, DriveFolder, StoreDriveContentStatus} from '../../Store/Drive/DriveReducer'
import {driveAction} from '../../Store/Drive/DriveActions'
import {
	driveSelectCurrentContentFiles,
	driveSelectCurrentContentFolders,
	driveSelectCurrentContentStatus,
	driveSelectParentId,
	driveSelectTreeFolders,
	driveSelectTreeStatus
} from '../../Store/Drive/DriveSelector'


type MyDrivePageProps = {
	authenticationKey: AuthenticationKey
}

export const MyDrivePage: FunctionComponent<MyDrivePageProps> = (props) => {
	const { authenticationKey } = props

	const dispatch = useDispatch<any>()
	const history = useHistory()
	const location = useLocation()

	const addFolderModal = useModal()
	const [renameFolderPending, setRenameFolderPending] = useState<DriveFolder | null>(null)
	const [renameFilePending, setRenameFilePending] = useState<DriveFile | null>(null)

	const treeStatus = useSelector(driveSelectTreeStatus)
	const treeFolders = useSelector(driveSelectTreeFolders)
	const parentId = useSelector(driveSelectParentId)

	const contentStatus = useSelector(driveSelectCurrentContentStatus)
	const contentFolders = useSelector(driveSelectCurrentContentFolders)
	const contentFiles = useSelector(driveSelectCurrentContentFiles)

	useEffect(() => {
		const urlSearch = new URLSearchParams(location.search)
		const folderId = urlSearch.get('folderId')
		dispatch(driveAction.getFolderContent({ authenticationKey, folderId }))
		dispatch(driveAction.changeFolderTree({ authenticationKey, folderId }))
	}, [authenticationKey, dispatch])

	/**
	 * @param folderId
	 */
	const onOpenFolder = (folderId: string | null) => {
		if (folderId) {
			const urlSearch = new URLSearchParams()
			urlSearch.set('folderId', folderId)
			history.push({ search: '?' + urlSearch.toString() })
		} else if (location.search.length > 0) {
			history.push({ search: '' })
		}
		dispatch(driveAction.getFolderContent({ authenticationKey, folderId }))
		dispatch(driveAction.changeFolderTree({ authenticationKey, folderId }))
	}

	/**
	 * @param file
	 */
	const onDownloadFile = async (file: DriveFile) => {
		const query = new URLSearchParams()
		query.set('fileId', file.id)
		query.set('authId', authenticationKey.id)
		query.set('authKey', authenticationKey.key)

		const link = document.createElement('a')
		link.download = 'download'
		link.href = `${process.env.REACT_APP_API}/api/drive/download-file?${query.toString()}`
		link.click()
	}

	/**
	 * @param name
	 */
	const onAddFolder = async (name: string) => {
		const id = toast.loading('Ajout du dossier')
		try {
			unwrapResult(await dispatch(driveAction.addFolder({
				authenticationKey, name, parentId
			})))
			toast.success('Dossier ajouté')
		} catch (e) {
			toast.error('Impossible d\'ajouter le dossier')
		} finally {
			toast.dismiss(id)
		}
	}

	/**
	 * @param name
	 */
	const onRenameFolder = async (name: string) => {
		const folder = renameFolderPending
		if (!folder || folder.name === name) {
			return
		}
		const id = toast.loading('Modication du dossier')
		try {
			unwrapResult(await dispatch(driveAction.renameFolder({
				authenticationKey, name, folder
			})))
			toast.success('Dossier renommé')
		} catch (e) {
			toast.error('Impossible de renommer le dossier')
		} finally {
			toast.dismiss(id)
		}
	}

	/**
	 * @param basename
	 */
	const onRenameFile = async (basename: string) => {
		const file = renameFilePending
		const split = basename.split('.').reverse()
		const name = split.slice(1).reverse().join('.')
		const extension = split[0]
		if (!file || (file.name === name && file.ext === extension)) {
			return
		}
		const id = toast.loading('Modication du fichier')
		try {
			unwrapResult(await dispatch(driveAction.renameFile({
				authenticationKey, file, name, extension
			})))
			toast.success('Fichier renommé')
		} catch (e) {
			toast.error('Impossible de renommer le fichier')
		} finally {
			toast.dismiss(id)
		}
	}

	return (
		<Template.Provider>
			<ModalInput
				name='Ajouter un dossier'
				display={addFolderModal.display}
				onClose={addFolderModal.hide}
				placeholder='Nom du dossier'
				description='Ajouter un nouveau dossier dans le répertoire courant.'
				onSubmit={onAddFolder}
			/>
			<ModalInput
				name='Renommer un dossier'
				display={!!renameFolderPending}
				onClose={() => setRenameFolderPending(null)}
				placeholder='Nouveau nom'
				defaultValue={renameFolderPending?.name}
				description='Modifier le nom du dossier sélectionné.'
				onSubmit={onRenameFolder}
			/>
			<ModalInput
				name='Renommer un fichier'
				display={!!renameFilePending}
				onClose={() => setRenameFilePending(null)}
				placeholder='Nouveau nom'
				defaultValue={[renameFilePending?.name, renameFilePending?.ext].join('.')}
				description='Modifier le nom du fichier sélectionné.'
				onSubmit={onRenameFile}
			/>
			<Template.Action>
				<ButtonNew onClick={() => {}}/>
			</Template.Action>
			<Template.Bar>
				<TreeFolder
					folders={treeFolders.map(folder => folder.folder)}
					onAddFolder={addFolderModal.show}
					onClick={(folder: DriveFolder) => onOpenFolder(folder.id)}
					onClickRoot={() => onOpenFolder(null)}
					onUploadFiles={() => {}}
					pending={treeStatus === StoreDriveContentStatus.PENDING}
					rootName='Mon Drive'
				/>
			</Template.Bar>
			<Template.Body>
				{(contentStatus === StoreDriveContentStatus.IDLE || contentStatus === StoreDriveContentStatus.PENDING) && <Spinner/>}
				{contentStatus === StoreDriveContentStatus.READY && <TableDrive
					folders={contentFolders.map(folder => folder.folder)}
					files={contentFiles.map(file => file.file)}
					onDownloadFile={onDownloadFile}
					onRenameFolder={setRenameFolderPending}
					onRenameFile={setRenameFilePending}
					onOpenFolder={folder => onOpenFolder(folder.id)}
				/>}
			</Template.Body>
		</Template.Provider>
	)
}
