import { licenses } from '$/editor';
import { get } from 'svelte/store';

export default function cleanLicense(data) {
	console.log(data['podcast:license']);
	if (data['podcast:license']) {
		if (!data?.['podcast:license']?.['#text']) {
			delete data['podcast:license'];
		} else {
			let foundLicense = get(licenses).find((v) => {
				return v?.value === data?.['podcast:license']?.['#text']?.toLowerCase();
			});

			if (!foundLicense && !data?.['podcast:license']?.['@_url']) {
				delete data['podcast:license'];
			}
		}
		console.log(data['podcast:license']);
	}
}
