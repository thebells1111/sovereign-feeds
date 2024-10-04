export default function cleanEpisodePerson(item) {
	if (item['podcast:person']) {
		item['podcast:person'] = [].concat(item['podcast:person']).filter((v) => {
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
		if (!item['podcast:person']?.length) {
			delete item['podcast:person'];
		}
	}
}
