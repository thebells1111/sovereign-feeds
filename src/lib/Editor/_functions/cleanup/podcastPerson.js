export default function cleanPodcastPerson(data) {
	if (data['podcast:person']) {
		if (!data['podcast:person'][0]['#text']) {
			delete data['podcast:person'];
		} else {
			data['podcast:person'] = data['podcast:person'].filter((v) => {
				if (v['#text'] === '') {
					return false;
				}
				if (!v['@_href']) {
					delete v['@_href'];
				}
				if (!v['@_img']) {
					delete v['@_img'];
				}
				if (!v['@_role']) {
					delete v['@_role'];
				}
				if (!v['@_group']) {
					delete v['@_group'];
				}
				return v;
			});
		}
	}
}
