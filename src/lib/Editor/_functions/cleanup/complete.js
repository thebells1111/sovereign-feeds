export default function cleanComplete(data) {
	if (data['podcast:complete']) {
		if (!data['podcast:complete']['@_archive']) {
			if (data['podcast:complete']['#_text'] === 'no') {
				delete data['podcast:complete'];
			} else {
				delete data['podcast:complete']['@_archive'];
			}
		}
	}
}
