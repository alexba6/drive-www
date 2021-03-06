import {createSlice, SerializedError} from "@reduxjs/toolkit";
import {driveAction} from "./DriveActions";

export enum StoreDriveStatus {
    IDLE = 'IDLE',
    UPDATING = 'UPDATING',
    REMOVING = 'REMOVING',
    ERROR = 'ERROR',
    READY = 'READY'
}

export enum StoreDriveContentStatus {
    IDLE = 'IDLE',
    PENDING = 'PENDING',
    ERROR = 'ERROR',
    READY = 'READY'
}

export type DriveFolder = {
    id: string
    name: string
    parentId: string | null
    updatedAt: Date
    createdAt: Date
}

export type DriveFile = {
    id: string
    name: string
    ext: string
    size: number
    parentId: string | null
    createdAt: Date
    updatedAt: Date
}

export type DriveFolderUpdate = {
    id: string,
    name?: string,
    updatedAt?: Date
}

export type DriveFolderAdd = {
    name: string
}

export type DriveFileUpdate = {
    id: string
    name?: string
    ext?: string
    size?: number
    updatedAt?: Date
}


export type StoreDriveFolder<S = StoreDriveStatus, C = StoreDriveContentStatus> = {
    status: S,
    contentStatus: C,
    id: DriveFolder['id'],
} & (S extends StoreDriveStatus.READY ? { folder: DriveFolder } : { folder?: DriveFolder } )
& (S extends StoreDriveStatus.UPDATING ? { update: DriveFolderUpdate } : {} )
& (S extends StoreDriveStatus.ERROR ? { error: SerializedError } : {} )
& (C extends StoreDriveContentStatus.ERROR ? { contentError: SerializedError } : {} )


export type StoreDriveFile<S = StoreDriveStatus> = {
    status: S,
    id: DriveFile['id'],
} & (S extends StoreDriveStatus.READY ? { file: DriveFile } : { file?: DriveFile } )
& (S extends StoreDriveStatus.UPDATING ? { update: DriveFileUpdate } : {} )
& (S extends StoreDriveStatus.ERROR ? { error: SerializedError } : {} )

export type StoreDriveRoot<C = StoreDriveContentStatus> = {
    contentStatus: C
} & (C extends StoreDriveContentStatus.ERROR ? { contentError: SerializedError } : {} )



export type DriveStoreState = {
    root: StoreDriveRoot,
    folders: StoreDriveFolder[],
    files: StoreDriveFile[],
    tree: {
        status: StoreDriveContentStatus,
        id: DriveFolder['id'] | null
    }
}

export type DriveStoreReducers = {
    clear: () => DriveStoreState,

}

export const driveStore = createSlice<DriveStoreState, DriveStoreReducers>({
    name: 'drive',
    initialState: {
        root: {
            contentStatus: StoreDriveContentStatus.IDLE
        },
        folders: [],
        files: [],
        tree: {
            status: StoreDriveContentStatus.IDLE,
            id: null
        }
    },
    reducers: {
        clear: () => ({
            root: {
                contentStatus: StoreDriveContentStatus.IDLE
            },
            folders: [],
            files: [],
            tree: {
                status: StoreDriveContentStatus.IDLE,
                id: null
            }
        }),
    },
    extraReducers: builder => {
        // Get folder content
        builder.addCase(driveAction.getFolderContent.pending, (state, props) => {
            const parentId = props.meta.arg.folderId
            if (parentId === null) {
                state.root = {
                    contentStatus: StoreDriveContentStatus.PENDING
                }
            } else {
                const folder = state.folders.find(folder => folder.id === parentId)
                if (folder) {
                    state.folders = [
                        ...state.folders.filter(folder => folder.id !== parentId),
                        {
                            ...folder,
                            contentStatus: StoreDriveContentStatus.PENDING
                        }
                    ]
                } else {
                    state.folders = [
                        ...state.folders,
                        {
                            id: parentId,
                            status: StoreDriveStatus.IDLE,
                            contentStatus: StoreDriveContentStatus.PENDING
                        }
                    ]
                }
            }
        })
        builder.addCase(driveAction.getFolderContent.fulfilled, (state, props) => {
            const parentId = props.meta.arg.folderId
            const addedFoldersId = props.payload.folders.map(folder => folder.id)
            const addedFilesId = props.payload.files.map(file => file.id)
            if (parentId === null) {
                state.root = {
                    contentStatus: StoreDriveContentStatus.READY
                }
            } else {
                const folder = state.folders.find(folder => folder.id === parentId)
                if (folder) {
                    state.folders = [
                        ...state.folders.filter(folder => folder.id !== parentId), {
                            ...folder,
                            contentStatus: StoreDriveContentStatus.READY
                        }
                    ]
                } else {
                    state.folders = [
                        ...state.folders,
                        {
                            id: parentId,
                            status: StoreDriveStatus.IDLE,
                            contentStatus: StoreDriveContentStatus.READY
                        }
                    ]
                }
            }
            state.folders = [
                ...state.folders.filter(folder => addedFoldersId.indexOf(folder.id) === -1),
                ...props.payload.folders.map((folder: DriveFolder): StoreDriveFolder<StoreDriveStatus.READY> => ({
                    id: folder.id,
                    status: StoreDriveStatus.READY,
                    contentStatus: state.folders.find(oldFolder => oldFolder.id === folder.id)?.contentStatus || StoreDriveContentStatus.IDLE,
                    folder: {
                        ...folder,
                        updatedAt: new Date(folder.updatedAt),
                        createdAt: new Date(folder.createdAt)
                    }
                }))
            ]
            state.files = [
                ...state.files.filter(file => addedFilesId.indexOf(file.id) === -1),
                ...props.payload.files.map((file: DriveFile): StoreDriveFile<StoreDriveStatus.READY> => ({
                    id: file.id,
                    status: StoreDriveStatus.READY,
                    file: {
                        ...file,
                        updatedAt: new Date(file.updatedAt),
                        createdAt: new Date(file.createdAt)
                    }
                }))
            ]
        })
        builder.addCase(driveAction.getFolderContent.rejected, (state, props) => {
            const parentId = props.meta.arg.folderId
            if (parentId === null) {
                state.root = {
                    contentStatus: StoreDriveContentStatus.ERROR,
                    contentError: props.error
                }
            } else {
                const folder = state.folders.find(folder => folder.id === parentId)
                if (folder) {
                    state.folders = [
                        ...state.folders.filter(folder => folder.id !== parentId),
                        {
                            ...folder,
                            contentStatus: StoreDriveContentStatus.ERROR,
                            error: props.error
                        }
                    ]
                } else {
                    state.folders = [
                        ...state.folders,
                        {
                            id: parentId,
                            status: StoreDriveStatus.IDLE,
                            contentStatus: StoreDriveContentStatus.ERROR,
                            contentError: props.error
                        }
                    ]
                }
            }
        })

        // Change folder
        builder.addCase(driveAction.changeFolderTree.pending, (state, props) => {
            state.tree.status = StoreDriveContentStatus.PENDING
            state.tree.id = props.meta.arg.folderId
        })
        builder.addCase(driveAction.changeFolderTree.fulfilled, (state, props) => {
            const addedFolder = props.payload.folders.map(folder => folder.id)
            state.tree.status = StoreDriveContentStatus.READY
            state.tree.id = props.meta.arg.folderId
            state.folders = [
                ...state.folders.filter(folder => addedFolder.indexOf(folder.id) === -1),
                ...props.payload.folders.map((folder: DriveFolder): StoreDriveFolder<StoreDriveStatus.READY> => {
                    const oldFolder = state.folders.find(oldFolder => oldFolder.id === folder.id)
                    return  {
                        id: folder.id,
                        status: StoreDriveStatus.READY,
                        contentStatus: oldFolder ? oldFolder.contentStatus : StoreDriveContentStatus.IDLE,
                        folder: {
                            ...folder,
                            updatedAt: new Date(folder.updatedAt),
                            createdAt: new Date(folder.createdAt)
                        }
                    }
                })
            ]
        })
        builder.addCase(driveAction.changeFolderTree.rejected, (state, props) => {
            state.tree.status = StoreDriveContentStatus.ERROR
            state.tree.id = props.meta.arg.folderId
        })

        // Add folder
        builder.addCase(driveAction.addFolder.fulfilled, (state, props) => {
            const folder = props.payload.folder

            state.folders = [
                ...state.folders, {
                    id: folder.id,
                    status: StoreDriveStatus.READY,
                    contentStatus: StoreDriveContentStatus.IDLE,
                    folder: {
                        ...folder,
                        createdAt: new Date(folder.createdAt),
                        updatedAt: new Date(folder.updatedAt)
                    }
                }
            ]
        })

        // Rename folder
        builder.addCase(driveAction.renameFolder.fulfilled, (state, props) => {
            const updatedFolder = props.payload.folder
            state.folders = [
                ...state.folders.filter(folder => folder.id !== updatedFolder.id), {
                    id: updatedFolder.id,
                    status: StoreDriveStatus.READY,
                    contentStatus: state.folders.find(folder => folder.id === updatedFolder.id)?.contentStatus || StoreDriveContentStatus.IDLE,
                    folder: {
                        ...updatedFolder,
                        updatedAt: new Date(updatedFolder.updatedAt),
                        createdAt: new Date(updatedFolder.createdAt)
                    }
                }
            ]
        })

        // Rename file
        builder.addCase(driveAction.renameFile.fulfilled, (state, props) => {
            const updatedFile = props.payload.file
            state.files = [
                ...state.files.filter(file => file.id !== updatedFile.id), {
                    id: updatedFile.id,
                    status: StoreDriveStatus.READY,
                    file: {
                        ...updatedFile,
                        updatedAt: new Date(updatedFile.updatedAt),
                        createdAt: new Date(updatedFile.createdAt)
                    }
                }
            ]
        })
    }
})
