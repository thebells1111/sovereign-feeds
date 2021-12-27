import { editingEpisode, rssData } from '$/editor';
import { get } from 'svelte/store';

export default function initializeImagesTag(data, type) {
	let defaultUrl =
		type === 'episode'
			? get(editingEpisode)?.['itunes:image']?.['@_href']
			: get(rssData)?.['itunes:image']?.['@_href'];

	if (data && data?.['@_srcset'] && typeof data?.['@_srcset'] === 'string') {
		data['@_srcset'] = data['@_srcset'].split(',').map((v) => {
			const t = v.trim().split(' ');
			return { url: t[0], width: '' };
		});

		const dupeUrlIndex = data['@_srcset'].findIndex(({ url }) => url === defaultUrl);
		data['@_srcset'].splice(dupeUrlIndex, 1);
		data['@_srcset'].unshift({
			url: defaultUrl,
			width: ''
		});
		return data;
	}

	return {
		'@_srcset': [
			{
				url: defaultUrl,
				width: ''
			}
		]
	};
}
