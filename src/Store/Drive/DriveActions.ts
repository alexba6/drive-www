import {createAsyncThunk} from '@reduxjs/toolkit'
import {DriveFile, DriveFolder} from './DriveReducer'
import {getAuthorization} from "../../Tools/Authentication";
import { AuthenticationKey } from '../../Context/ContextAuthentication';

type DriveGetFolderContentProps = {
    authenticationKey: AuthenticationKey
    folderId: string | null
}

type DriveActionGetFolderTreeProps = {
    authenticationKey: AuthenticationKey
    folderId: string | null
}

type DriveActionAddFolderProps = {
    authenticationKey: AuthenticationKey
    name: string
    parentId: string | null
}

type DriveGetFolderContent = {
    folders: DriveFolder[]
    files: DriveFile[]
}
type DriveActionGetFolderTree = {
    folders: DriveFolder[]
}

type DriveAddFolder = {
    folder: DriveFolder
}

const getFolderContent = createAsyncThunk<DriveGetFolderContent, DriveGetFolderContentProps>(
    'drive#getFolderContent',
    async (props: DriveGetFolderContentProps) => {
        const urlSearch = new URLSearchParams()
        if (props.folderId) {
            urlSearch.set('parentId', props.folderId)
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

const changeFolderTree = createAsyncThunk<DriveActionGetFolderTree, DriveActionGetFolderTreeProps>(
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


const addFolder = createAsyncThunk<DriveAddFolder, DriveActionAddFolderProps>(
    'drive#addFolder',
    async (props: DriveActionAddFolderProps) => {
        const res = await fetch('/api/drive/folder', {
            method: 'POST',
            headers: {
                authorization: getAuthorization(props.authenticationKey),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: props.name,
                parentId: props.parentId
            })
        })
        return await res.json()
    }
)


export const driveAction = {
    getFolderContent,
    changeFolderTree,
    addFolder
}
