import {RootState} from "../index";
import {StoreDriveContentStatus, StoreDriveFile, StoreDriveFolder, StoreDriveStatus} from "./DriveReducer";

/**
 * @param store
 */
export const driveSelectCurrentContentFolders = (store: RootState): StoreDriveFolder<StoreDriveStatus.READY>[] => {
    const driveStore = store.drive
    return driveStore.folders.filter(folder => (
        folder.status === StoreDriveStatus.READY
        && folder.folder?.parentId === driveStore.currentFolder.id
    )) as StoreDriveFolder<StoreDriveStatus.READY>[]
}

/**
 * @param store
 */
export const driveSelectCurrentContentFiles = (store: RootState): StoreDriveFile<StoreDriveStatus.READY>[] => {
    const driveStore = store.drive
    return driveStore.files.filter(file => (
        file.file?.parentId === driveStore.currentFolder.id
        && file.status === StoreDriveStatus.READY
    )) as StoreDriveFile<StoreDriveStatus.READY>[]
}

/**
 * @param store
 */
export const driveSelectCurrentContentStatus = (store: RootState): StoreDriveContentStatus | undefined => {
    const driveStore = store.drive
    const currentFolderId = driveStore.currentFolder.id
    if (currentFolderId === 'ROOT') {
        return driveStore.root.contentStatus
    }
    return driveStore.folders.find(folder => folder.id === driveStore.currentFolder.id)?.contentStatus
}

/**
 * @param store
 */
export const driveSelectCurrentFolder = (store: RootState): StoreDriveFolder | null | undefined  => {
    const driveStore = store.drive
    const folderId = driveStore.currentFolder.id
    if (!folderId) {
        return null
    }
    return driveStore.folders.find(folder => folder.id === folderId)
}

/**
 * @param state
 */
export const driveSelectTreeFolders = (state: RootState): StoreDriveFolder<StoreDriveStatus.READY>[] => {
    const driveStore = state.drive
    let folderId = driveStore.currentFolder.id
    const treeFolders: StoreDriveFolder<StoreDriveStatus.READY>[] = []
    while (folderId) {
        const folder = driveStore.folders
            .find(folder => folder.id === folderId && folder.status === StoreDriveStatus.READY) as StoreDriveFolder<StoreDriveStatus.READY> | undefined
        if (folder && folder.status === StoreDriveStatus.READY) {
            treeFolders.push(folder)
            folderId = folder.folder.parentId
        } else {
            return []
        }
    }
    return treeFolders.reverse()
}
