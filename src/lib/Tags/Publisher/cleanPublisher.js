export default function cleanPodroll(data) {
	data['podcast:remoteItem'] = data['podcast:remoteItem'].filter((v) => {
		if (!v['@_feedGuid']) {
			return false;
		}
		if (!v['@_itemGuid']) {
			delete v['@_itemGuid'];
		}
		if (!v['@_feedUrl']) {
			delete v['@_feedUrl'];
		}
		if (!v['@_feedImg']) {
			delete v['@_feedImg'];
		}
		return v;
	});

	if (!data?.['podcast:remoteItem']?.length) {
		delete data['podcast:remoteItem'];
	}
	console.log(data?.['podcast:remoteItem']);
}
