import React, {FunctionComponent, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from "@reduxjs/toolkit";
import {toast} from "react-toastify";

import {Template} from '../Template/Template'
import {ButtonNew} from '../Components/Button/ButtonNew'
import {TableDrive} from '../Components/Table/TableDrive'
import {TreeFolder} from "../Components/TreeFolder/TreeFolder";
import {useHistory, useLocation} from "react-router-dom";
import {Spinner} from "../Components/Spinner/Spinner";
import {ModalInput} from "../Components/Modal/ModalInput";

import {useModal} from "../hooks/UseModal";
import {AuthenticationKey} from '../Context/ContextAuthentication'
import {DriveFile, DriveFolder, StoreDriveContentStatus} from '../Store/Drive/DriveReducer'
import {driveAction} from '../Store/Drive/DriveActions'
import {
	driveSelectCurrentContentFiles,
	driveSelectCurrentContentFolders,
	driveSelectCurrentContentStatus, driveSelectParentId,
	driveSelectTreeFolders,
	driveSelectTreeStatus
} from '../Store/Drive/DriveSelector'
import {getAuthorization} from "../Tools/Authentication";


type MyDrivePageProps = {
	authenticationKey: AuthenticationKey
}

export const MyDrivePage: FunctionComponent<MyDrivePageProps> = (props) => {
	const { authenticationKey } = props

	const dispatch = useDispatch<any>()
	const history = useHistory()
	const location = useLocation()

	const addFolderModal = useModal()

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
		const resToken = await fetch(`/api/drive/download-token?fileId=${file.id}`, {
			method: 'GET',
			headers: {
				authorization: getAuthorization(authenticationKey)
			}
		})
		if (resToken.status !== 200) {
			return
		}
		const json = await resToken.json()
		const link = document.createElement('a')
		link.download = 'download'
		link.href = `${process.env.REACT_APP_API}/api/drive/download-file?token=${json.download.token}`
		link.click()
	}

	/**
	 * @param name
	 */
	const onAddFolder = async (name: string) => {
		const id = toast.loading('Ajout du dossier')
		try {
			const { folder } = unwrapResult(await dispatch(driveAction.addFolder({
				authenticationKey, name, parentId
			})))
			toast.success(`"${folder.name}" ajouté`)
		} catch (e) {
			toast.error('Impossible d\'ajouter le dossier')
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
					onOpenFolder={(folder: DriveFolder) => onOpenFolder(folder.id)}
				/>}
			</Template.Body>
		</Template.Provider>
	)
}
