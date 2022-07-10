import {createAsyncThunk} from '@reduxjs/toolkit'
import {DriveFile, DriveFolder} from './DriveReducer'
import {getAuthorization} from "../../Tools/Authentication";
import { AuthenticationKey } from '../../Context/ContextAuthentication';

type GetFolderContentProps = {
    authenticationKey: AuthenticationKey
    folderId: string | null
}

type GetFolderTreeProps = {
    authenticationKey: AuthenticationKey
    folderId: string | null
}

type AddFolderProps = {
    authenticationKey: AuthenticationKey
    name: string
    parentId: string | null
}

type RenameFolderProps = {
    authenticationKey: AuthenticationKey
    folder: DriveFolder
    name: string
}

type RenameFileProps = {
    authenticationKey: AuthenticationKey
    file: DriveFile
    name: string
    extension: string
}

type GetFolderContent = {
    folders: DriveFolder[]
    files: DriveFile[]
}
type ActionGetFolderTree = {
    folders: DriveFolder[]
}

type AddFolder = {
    folder: DriveFolder
}

type RenameFolder = {
    folder: DriveFolder
}

type RenameFile = {
    file: DriveFile
}

const getFolderContent = createAsyncThunk<GetFolderContent, GetFolderContentProps>(
    'drive#getFolderContent',
    async (props: GetFolderContentProps) => {
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

const changeFolderTree = createAsyncThunk<ActionGetFolderTree, GetFolderTreeProps>(
    'drive#getFolderTree',
    async (props: GetFolderTreeProps) => {
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


const addFolder = createAsyncThunk<AddFolder, AddFolderProps>(
    'drive#addFolder',
    async (props: AddFolderProps) => {
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

const renameFolder = createAsyncThunk<RenameFolder, RenameFolderProps>(
    'drive#renameFolder',
    async (props: RenameFolderProps) => {
        const res = await fetch('/api/drive/folder', {
            method: 'PUT',
            headers: {
                authorization: getAuthorization(props.authenticationKey),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderId: props.folder.id,
                name: props.name
            })
        })
        return await res.json()
    }
)

const renameFile = createAsyncThunk<RenameFile, RenameFileProps>(
    'drive#renameFile',
    async (props: RenameFileProps) => {
        const res = await fetch('/api/drive/file', {
            method: 'PUT',
            headers: {
                authorization: getAuthorization(props.authenticationKey),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: props.file.id,
                name: props.name,
                extension: props.extension
            })
        })
        return await res.json()
    }
)

export const driveAction = {
    getFolderContent,
    changeFolderTree,
    addFolder,
    renameFolder,
    renameFile
}
