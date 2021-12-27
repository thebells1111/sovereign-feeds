export default function cleanLicense(data) {
	if (data['podcast:license']) {
		if (!data['podcast:license']['#text']) {
			delete data['podcast:license'];
		}
	}
}
