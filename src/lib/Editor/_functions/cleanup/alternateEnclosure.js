import blankAlternateEnclosure from '../blanks/alternateEnclosure';

export default function cleanAlternateEnclosure(data) {
	if (data['podcast:alternateEnclosure']) {
		data['podcast:alternateEnclosure'] = data['podcast:alternateEnclosure']
			.map((v) => {
				// Filter podcast:source

				v['podcast:source'] = [].concat(v['podcast:source']).filter((source) => source['@_uri']);

				// Remove blank keys
				Object.keys(v).forEach((key) => {
					if (key === 'podcast:source') {
						v[key].forEach((w, i) => {
							if (!w['@_contentType']) {
								delete w['@_contentType'];
							}
						});
						if (!v[key]['@_contentType']) {
							delete v[key]['@_contentType'];
						}
					}
					if (v[key] === '') {
						delete v[key];
					}
				});
				return v;
			})
			.filter((v) => v?.['podcast:source']?.length > 0 && v['@_type']); // Remove if podcast:source is empty or @_type is missing
	}
}
