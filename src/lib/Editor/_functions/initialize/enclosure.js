import { trackerDB, selectedPodcast } from '$/editor';
import { get } from 'svelte/store';

export default async function initializeEnclosure(data) {
	console.log();
	const trackers = (await trackerDB.getItem(`${get(selectedPodcast).url}`)) || { active: [] };
	data = data || { '@_url': '' };
	console.log(trackers);
	trackers.active.forEach((tracker) => {
		data['@_url'] = data['@_url']?.split(tracker).join('') || data['@_url'];
	});
	return data;
}
