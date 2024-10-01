export default function cleanPodroll(data) {
	if (data['podcast:podroll']) {
		data['podcast:podroll']['podcast:remoteItem'] = data['podcast:podroll'][
			'podcast:remoteItem'
		].filter((v) => {
			if (!v['@_feedGuid']) {
				return false;
			}
			if (!v['@_itemGuid']) {
				delete v['@_itemGuid'];
			}
			return v;
		});
	}

	if (!data?.['podcast:podroll']?.['podcast:remoteItem']?.length) {
		delete data['podcast:podroll'];
	}
	console.log(data?.['podcast:podroll']);
}
