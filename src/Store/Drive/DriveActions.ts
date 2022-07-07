import {createAsyncThunk} from '@reduxjs/toolkit'
import {DriveFile, DriveFolder} from './DriveReducer'
import {getAuthorization} from "../../Tools/Authentication";
import { AuthenticationKey } from '../../Context/ContextAuthentication';
import {useDispatch} from "react-redux";

type DriveGetFolderContentProps = {
    parentId: string | null,
    authenticationKey: AuthenticationKey
}

type DriveActionGetFolderTreeProps = {
    folderId: string | null,
    authenticationKey: AuthenticationKey
}

type DriveGetFolderContent = {
    folders: DriveFolder[],
    files: DriveFile[]
}
type DriveActionGetFolderTree = {
    folders: DriveFolder[]
}

export const driveActionGetFolderContent = createAsyncThunk<DriveGetFolderContent, DriveGetFolderContentProps>(
    'drive#getFolderContent',
    async (props: DriveGetFolderContentProps) => {
        const urlSearch = new URLSearchParams()
        if (props.parentId) {
            urlSearch.set('parentId', props.parentId)
        }
        const res = await fetch(`/api/drive?${urlSearch.toString()}`, {
            method: 'GET',
            headers: {
                authorization: getAuthorization(props.authenticationKey)
            }
        })
        return await res.json()
    }
)

export const driveActionChangeFolderTree = createAsyncThunk<DriveActionGetFolderTree, DriveActionGetFolderTreeProps>(
    'drive#getFolderTree',
    async (props: DriveActionGetFolderTreeProps) => {
        if (props.folderId === null) {
            return {
                folders: []
            }
        }
        const urlSearch = new URLSearchParams()
        urlSearch.set('folderId', props.folderId)
        const res = await fetch(`/api/drive/treeFolders?${urlSearch.toString()}`, {
            method: 'GET',
            headers: {
                authorization: getAuthorization(props.authenticationKey)
            }
        })
        return await res.json()
    }
)
