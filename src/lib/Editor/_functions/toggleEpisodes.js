import initializeEpisode from '$lib/Editor/_functions/initializeEpisode';

import { showLiveEpisodes, episodesList, liveEpisodes, editingEpisodes, rightPane } from '$/editor';

import { get } from 'svelte/store';
import { regularEpisodes } from 'src/store/editor';

export default function toggleEpisodes() {
	if (get(showLiveEpisodes)) {
		let $liveEpisodes = get(liveEpisodes);
		episodesList.set($liveEpisodes);
		initializeEpisode($liveEpisodes[0], 'live');
		editingEpisode.set($liveEpisodes[0]);
		rightPane.set('liveItem');
	} else {
		let $regularEpisodes = get(regularEpisodes);
		episodesList.set($regularEpisodes);
		initializeEpisode($regularEpisodes[0]);
		editingEpisode.set(regularEpisodes[0]);
		rightPane.set('episodeMetadata');
	}
}
