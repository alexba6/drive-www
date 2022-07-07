import { FunctionComponent } from 'react'

import MdiImage from '../../Icons/FilesType/MdiImage'
import MdiVideo from '../../Icons/FilesType/MdiVideo'
import MdiFileDocument from '../../Icons/FilesType/MdiFileDocument'
import MdiFileMusic from '../../Icons/FilesType/MdiFileMusic'
import MdiFilePdf from '../../Icons/FilesType/MdiFilePdf'
import MdiTextBox from '../../Icons/FilesType/MdiTextBox'
import MdiLanguageTypescript from '../../Icons/FilesType/MdiLanguageTypescript'
import MdiLanguageJavascript from '../../Icons/FilesType/MdiLanguageJavascript'
import MdiLanguagePython from '../../Icons/FilesType/MdiLanguagePython'
import MdiCodeJson from '../../Icons/FilesType/MdiCodeJson'
import MdiFile from '../../Icons/MdiFile'
import {DriveFile} from "../../Store/Drive/DriveReducer";

type FileIconProps = {
	file: DriveFile
}

/**
 *
 * @param props
 * @constructor
 */
export const FileIcon: FunctionComponent<FileIconProps> = (props) => {
	const ext = props.file.ext.toLowerCase()
	if (['jpg', 'jpeg', 'png'].indexOf(ext) !== -1) {
		return <MdiImage />
	} else if (['mp4', 'avi', 'mkv'].indexOf(ext) !== -1) {
		return <MdiVideo />
	} else if (['odt'].indexOf(ext) !== -1) {
		return <MdiFileDocument />
	} else if (['mp3'].indexOf(ext) !== -1) {
		return <MdiFileMusic />
	} else if (ext === 'pdf') {
		return <MdiFilePdf />
	} else if (['txt', 'note'].indexOf(ext) !== -1) {
		return <MdiTextBox />
	} else if (['ts', 'tsx'].indexOf(ext) !== -1) {
		return <MdiLanguageTypescript />
	} else if (['js', 'jsx'].indexOf(ext) !== -1) {
		return <MdiLanguageJavascript />
	} else if (ext === 'py') {
		return <MdiLanguagePython />
	} else if (ext === 'json') {
		return <MdiCodeJson />
	}
	return <MdiFile />
}
