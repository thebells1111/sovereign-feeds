export default function cleanPodroll(data) {
	if (data['podcast:podroll']) {
		data['podcast:podroll'] = data['podcast:podroll']['podcast:remoteItem'].filter((v) => {
			if (!v['@_feedGuid']) {
				return false;
			}
			if (!v['@_itemGuid']) {
				delete v['@_itemGuid'];
			}
			return v;
		});
	}
	console.log(data?.['podcast:podroll']);
}
