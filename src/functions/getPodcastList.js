import sortPodcastList from '$functions/sortPodcastList';
import { mainPodcastList, pinNew, podcastList, devMode } from '$/stores';

import { get } from 'svelte/store';

export default async function getPodcastList() {
	const w = new Worker('/workers/getPodcastList.js');
	w.postMessage(true);
	w.onmessage = function (event) {
		if (event.data) {
			mainPodcastList.set(sortPodcastList(event.data, get(pinNew)).filter((v) => v.id));
			podcastList.set([...get(mainPodcastList)]);
			w.terminate();
		}
	};
}
