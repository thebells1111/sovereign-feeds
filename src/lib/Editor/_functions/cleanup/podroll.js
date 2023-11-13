export default function cleanPodroll(data) {
	if (data['podcast:podroll']) {
		data['podcast:podroll'] = data['podcast:podroll'].filter((v) => {
			if (!v['@_feedGuid']) {
				return false;
			}
			if (!v['@_itemGuid']) {
				delete v['@_itemGuid'];
			}
			return v;
		});
	}
}
