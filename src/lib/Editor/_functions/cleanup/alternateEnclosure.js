import blankAlternateEnclosure from '../blanks/alternateEnclosure';

export default function cleanAlternateEnclosure(data) {
	if (data['podcast:alternateEnclosure']) {
		data['podcast:alternateEnclosure'] = data['podcast:alternateEnclosure']
			.map((v) => {
				// Filter podcast:source
				v['podcast:source'] = v['podcast:source'].filter((source) => source['@_uri']);

				// Remove unwanted keys
				Object.keys(v).forEach((key) => {
					if (!(key in blankAlternateEnclosure) || v[key] === '') {
						delete v[key];
					}
				});

				return v;
			})
			.filter((v) => v['podcast:source'].length > 0 && v['@_type']); // Remove if podcast:source is empty or @_type is missing
	}
	console.log(data['podcast:alternateEnclosure']);
}
