export default function cleanLiveValue(data) {
	if (data['podcast:liveValue']) {
		if (!data['podcast:liveValue']['@_uri'] || !data['podcast:liveValue']['@_protocol']) {
			delete data['podcast:liveValue'];
		}
	}
}
