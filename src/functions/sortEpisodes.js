import { selectedPodcastState } from '$/stores';
import { get } from 'svelte/store';

const podcastState = get(selectedPodcastState);

export default function sortEpisodes(list, sorter, filter) {
	let newList = [];
	if (list?.length > 0) {
		newList = [...list];
		if (filter?.complete) {
			newList = newList.filter((episode) => {
				let show = !podcastState[episode.id]?.complete;

				return show;
			});
		}
		newList = newList.sort((a, b) => {
			if (sorter === 'newest') {
				return a.datePublished < b.datePublished ? 1 : -1;
			} else if (sorter === 'oldest') {
				return a.datePublished > b.datePublished ? 1 : -1;
			}
		});
	}

	return newList;
}
