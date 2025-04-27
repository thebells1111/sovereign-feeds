export default function cleanLocation(data) {
	const locations = data['podcast:location'];
	if (!locations) return;

	if (!Array.isArray(locations)) {
		data['podcast:location'] = [locations];
	}

	data['podcast:location'] = data['podcast:location'].filter((loc) => {
		const hasText = loc['#text'] && loc['#text'].trim().length > 0;
		if (!hasText) return false; // No node text -> delete location

		// Clean optional attributes
		['@_rel', '@_geo', '@_osm', '@_country'].forEach((attr) => {
			if (!loc[attr]) delete loc[attr];
		});

		// Truncate node text at 128 characters max
		if (loc['#text'].length > 128) {
			loc['#text'] = loc['#text'].slice(0, 128);
		}

		return true;
	});

	if (data['podcast:location'].length === 0) {
		delete data['podcast:location'];
	}
}
