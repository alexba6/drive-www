import React, {
	FunctionComponent,
	useEffect
} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Template} from '../Template/Template'
import {ButtonNew} from '../Components/Button/ButtonNew'
import {TableDrive} from '../Components/Table/TableDrive'

import {AuthenticationKey } from '../Context/ContextAuthentication'
import {DriveFolder, StoreDriveContentStatus} from '../Store/Drive/DriveReducer'
import {driveActionChangeFolderTree, driveActionGetFolderContent} from '../Store/Drive/DriveActions'
import {
	driveSelectCurrentContentFiles,
	driveSelectCurrentContentFolders,
	driveSelectCurrentContentStatus,
	driveSelectTreeFolders
} from '../Store/Drive/DriveSelector'
import {TreeFolder} from "../Components/TreeFolder/TreeFolder";


type MyDrivePageProps = {
	authenticationKey: AuthenticationKey
}

export const MyDrivePage: FunctionComponent<MyDrivePageProps> = (props) => {
	const dispatch = useDispatch()
	const { authenticationKey } = props

	const contentStatus = useSelector(driveSelectCurrentContentStatus)
	const treeFolders = useSelector(driveSelectTreeFolders)

	const contentFolders = useSelector(driveSelectCurrentContentFolders)
	const contentFiles = useSelector(driveSelectCurrentContentFiles)

	useEffect(() => {
		dispatch(driveActionGetFolderContent({
			authenticationKey, parentId: null
		}))
	}, [authenticationKey, dispatch])

	const onOpenFolder = (folderId: string | null) => {
		dispatch(driveActionChangeFolderTree({
			authenticationKey, folderId
		}))
		dispatch(driveActionGetFolderContent({
			authenticationKey, parentId: folderId
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
					rootName='Mon Drive'
				/>
			</Template.Bar>
			<Template.Body>
				{(contentStatus === StoreDriveContentStatus.IDLE || contentStatus === StoreDriveContentStatus.PENDING) && 'Pending...'}
				<TableDrive
					folders={contentFolders.map(folder => folder.folder)}
					files={contentFiles.map(file => file.file)}
					onDownloadFile={() => {}}
					onOpenFolder={(folder: DriveFolder) => onOpenFolder(folder.id)}
				/>
			</Template.Body>
		</Template.Provider>
	)
}
