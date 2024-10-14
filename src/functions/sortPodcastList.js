import { seenEpisodesCounts } from '$/stores';

import { get } from 'svelte/store';

export default function sortPodcastList(list, pinNew) {
	let sorted = list.sort((a, b) => {
		return a.title > b.title ? 1 : -1;
	});
	if (pinNew) {
		let unseenEpisodes = [];
		let seenEpisodes = [];

		for (const podcast of sorted) {
			let count = get(seenEpisodesCounts)[podcast.id] || 0;
			if (podcast.item && podcast.item.length - count > 0) {
				unseenEpisodes.push(podcast);
			} else {
				seenEpisodes.push(podcast);
			}
		}

		sorted = unseenEpisodes.concat(seenEpisodes);
	}
	return sorted;
}
