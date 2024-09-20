import { editingEpisode, rssData } from '$/editor';
import { get } from 'svelte/store';

export default function initializeImagesTag(data, type) {
	let defaultUrl =
		type === 'episode'
			? get(editingEpisode)?.['itunes:image']?.['@_href']
			: get(rssData)?.['itunes:image']?.['@_href'];

	// Default aspect ratios we need
	const requiredAspectRatios = ['1/1', '16/9', '40/1', '4/3'];

	// Initialize or update existing data
	if (!data || !Array.isArray(data)) data = [];

	// Iterate through required aspect ratios
	requiredAspectRatios.forEach((ratio) => {
		// Check if the current ratio is already in data
		let imageTag = data.find((img) => img['@_aspect-ratio'] === ratio);

		console.log(data);

		if (!imageTag) {
			// If the ratio doesn't exist in data, create a new entry
			data.push({
				'@_aspect-ratio': ratio,
				'@_src': ratio === '1/1' ? defaultUrl : '', // DefaultUrl only for 1/1
				'@_srcset': [{ url: '', width: '' }]
			});
		}
	});

	// Convert string srcset to array for non-1/1 ratios
	data.forEach((imageTag) => {
		if (typeof imageTag?.['@_srcset'] === 'string') {
			imageTag['@_srcset'] = imageTag['@_srcset'].split(',').map((v) => {
				const t = v.trim().split(' ');
				return { url: t[0], width: '' };
			});
		}
	});

	// Return the updated data
	return data;
}
