export default function cleanTrailer(data) {
	if (data['podcast:trailer']) {
		if (!data['podcast:trailer']['@_url'] || !data['podcast:trailer']['@_pubdate']) {
			delete data['podcast:trailer'];
		} else {
			if (!data['podcast:trailer']['@_length']) {
				delete data['podcast:trailer']['@_length'];
			}

			if (!data['podcast:trailer']['@_type']) {
				delete data['podcast:trailer']['@_type'];
			}

			if (!data['podcast:trailer']['@_season']) {
				delete data['podcast:trailer']['@_season'];
			}
		}
	}
}
