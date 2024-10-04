export default function cleanLocked(data) {
	if (data['podcast:locked']) {
		if (!data['podcast:locked']['@_owner']) {
			delete data['podcast:locked'];
		}
	}
}
