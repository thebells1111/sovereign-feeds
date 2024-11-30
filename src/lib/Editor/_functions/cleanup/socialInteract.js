export default function cleanPodcastSocialInteract(data) {
	if (data['podcast:socialInteract']) {
		data['podcast:socialInteract'] = [].concat(data['podcast:socialInteract']).filter((v, i) => {
			if (!v['@_uri']) {
				if (v['#text']) {
					v['@_uri'] = v['#text'];
				} else {
					return false;
				}
			}
			if (!v['@_protocol']) {
				if (v['@_platform']) {
					v['@_protocol'] = v['@_platform'];
				} else {
					return false;
				}
			}

			if (!v['@_accountId']) {
				if (v['@_podcastAccountId']) {
					v['@_accountId'] = v['@_podcastAccountId'];
				} else {
					delete v['@_accountId'];
				}
			}
			if (!v['@_accountUrl']) {
				if (v['@_podcastAccountUrl']) {
					v['@_accountUrl'] = v['@_podcastAccountUrl'];
				} else {
					delete v['@_accountUrl'];
				}
			}
			if (!v['@_priority']) {
				delete v['@_priority'];
			}

			//these are from an earlier implementation of socialInteract
			//maybe delete later  (3/25/2022)
			delete v['#text'];
			delete v['@_pubDate'];
			delete v['@_podcastAccountId'];
			delete v['@_podcastAccountUrl'];
			delete v['@_platform'];

			return true;
		});
		if (!data['podcast:socialInteract']?.length) {
			delete data['podcast:socialInteract'];
		}
	}
}
