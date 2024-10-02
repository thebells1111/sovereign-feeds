export default function cleanPodcastImages(data) {
	if (
		data['experimental:images'] &&
		data['experimental:images']['@_srcset'] &&
		typeof data['experimental:images']['@_srcset'] !== 'string'
	) {
		data['experimental:images']['@_srcset'] = data['experimental:images']['@_srcset'].filter(
			(v) => {
				if (!v.url) {
					return false;
				}
				if (!Number(v.width)) {
					return false;
				}

				return v;
			}
		);

		data['experimental:images']['@_srcset'] = data['experimental:images']['@_srcset']
			.map((v) => `${v.url} ${v.width}w`)
			.join(', ');

		if (!data['experimental:images']['@_srcset']) {
			delete data['experimental:images'];
		}
	} else {
		delete data['experimental:images'];
	}
}
