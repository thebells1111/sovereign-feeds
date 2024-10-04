export default function cleanPodcastImages(data) {
	if (
		data['podcast:images'] &&
		data['podcast:images']['@_srcset'] &&
		typeof data['podcast:images']['@_srcset'] !== 'string'
	) {
		data['podcast:images']['@_srcset'] = data['podcast:images']['@_srcset'].filter((v) => {
			if (!v.url) {
				return false;
			}
			if (!Number(v.width)) {
				return false;
			}

			return v;
		});

		data['podcast:images']['@_srcset'] = data['podcast:images']['@_srcset']
			.map((v) => `${v.url} ${v.width}w`)
			.join(', ');

		if (!data['podcast:images']['@_srcset']) {
			delete data['podcast:images'];
		}
	}
}
