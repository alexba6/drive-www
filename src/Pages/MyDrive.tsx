import React, {FunctionComponent, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Template} from '../Template/Template'
import {ButtonNew} from '../Components/Button/ButtonNew'
import {TableDrive} from '../Components/Table/TableDrive'

import {AuthenticationKey} from '../Context/ContextAuthentication'
import {DriveFolder, StoreDriveContentStatus} from '../Store/Drive/DriveReducer'
import {driveActionChangeFolderTree, driveActionGetFolderContent} from '../Store/Drive/DriveActions'
import {
	driveSelectCurrentContentFiles,
	driveSelectCurrentContentFolders,
	driveSelectCurrentContentStatus,
	driveSelectTreeFolders,
	driveSelectTreeStatus
} from '../Store/Drive/DriveSelector'
import {TreeFolder} from "../Components/TreeFolder/TreeFolder";
import {useHistory, useLocation} from "react-router-dom";
import {Spinner} from "../Components/Spinner/Spinner";


type MyDrivePageProps = {
	authenticationKey: AuthenticationKey
}

export const MyDrivePage: FunctionComponent<MyDrivePageProps> = (props) => {
	const { authenticationKey } = props

	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const treeStatus = useSelector(driveSelectTreeStatus)
	const treeFolders = useSelector(driveSelectTreeFolders)

	const contentStatus = useSelector(driveSelectCurrentContentStatus)
	const contentFolders = useSelector(driveSelectCurrentContentFolders)
	const contentFiles = useSelector(driveSelectCurrentContentFiles)

	useEffect(() => {
		const urlSearch = new URLSearchParams(location.search)
		const folderId = urlSearch.get('folderId')
		dispatch(driveActionChangeFolderTree({
			authenticationKey, folderId
		}))
		dispatch(driveActionGetFolderContent({
			authenticationKey, folderId
		}))
	}, [authenticationKey, dispatch])

	const onOpenFolder = (folderId: string | null) => {
		if (folderId) {
			const urlSearch = new URLSearchParams()
			urlSearch.set('folderId', folderId)
			history.push({
				search: '?' + urlSearch.toString()
			})
		} else {
			history.push({ search: '' })
		}

		dispatch(driveActionChangeFolderTree({
			authenticationKey, folderId
		}))
		dispatch(driveActionGetFolderContent({
			authenticationKey, folderId
		}))
	}

	return (
		<Template.Provider>
			<Template.Action>
				<ButtonNew onClick={() => {}}>

				</ButtonNew>
			</Template.Action>
			<Template.Bar>
				<TreeFolder
					folders={treeFolders.map(folder => folder.folder)}
					onAddFolder={() => {}}
					onClick={(folder: DriveFolder) => onOpenFolder(folder.id)}
					onClickRoot={() => onOpenFolder(null)}
					onUploadFiles={() => {}}
					pending={treeStatus === StoreDriveContentStatus.PENDING}
					rootName='Mon Drive'
				/>
			</Template.Bar>
			<Template.Body>
				{(contentStatus === StoreDriveContentStatus.IDLE || contentStatus === StoreDriveContentStatus.PENDING) && <div className='flex-center'>
					<Spinner/>
				</div>}
				{contentStatus === StoreDriveContentStatus.READY && <TableDrive
					folders={contentFolders.map(folder => folder.folder)}
					files={contentFiles.map(file => file.file)}
					onDownloadFile={() => {}}
					onOpenFolder={(folder: DriveFolder) => onOpenFolder(folder.id)}
				/>}
			</Template.Body>
		</Template.Provider>
	)
}
