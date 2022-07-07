type InputFiles = File[]

export const useInputFiles = (): (() => Promise<InputFiles>) => async () => {
	const input = document.createElement('input')
	input.type = 'file'
	input.multiple = true
	const getFiles = () =>
		new Promise<File[]>((resolve) => {
			input.onchange = (e: Event) => {
				const target = e.target as HTMLInputElement
				const files: File[] = Array.from(target.files as any)
				resolve(files)
			}
		})
	input.click()
	return await getFiles()
}
