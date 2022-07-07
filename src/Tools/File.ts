/**
 * @param size
 */
export const getFileMultipleSize = (size: number): String => {
	const multiples = ['o', 'Ko', 'Mo', 'Go', 'To']

	for (let i=1;i<=multiples.length;i++) {
		if (size < 1023 ** i) {
			return Math.floor(100 * size / 1000 ** (i - 1)) / 100 + multiples[i - 1]
		}
	}
	return ''
}
