import setVTT from '$functions/setVTT';

import {
	srcStartTime,
	srcStopTime,
	playingEpisode,
	player,
	playerSrc,
	playerSrcType,
	playerTime
} from '$/stores';

import { get } from 'svelte/store';

export default function loadSrc() {
	playerSrc.set(get(playingEpisode)?.enclosureUrl || '/curiovideo.mp4');
	playerSrcType.set(get(playingEpisode)?.enclosureType || 'video/mp4');

	get(playingEpisode)?.alternateEnclosure?.forEach((v) => {
		if (v.type === 'application/x-mpegURL') {
			playerSrc.set(v['podcast:source'].uri);
			playerSrcType.set('application/x-mpegURL');
		} else if (v.type === 'audio/aac') {
			playerSrc.set(v['podcast:source'].uri);
			playerSrcType.set('audio/aac');
		}
	});

	playerSrc.set(get(srcStartTime) ? get(playerSrc) + `#t=${get(srcStartTime)}` : get(playerSrc));
	playerSrc.set(get(srcStopTime) ? get(playerSrc) + `,${get(srcStopTime)}` : get(playerSrc));
	if (get(player) && get(srcStartTime)) {
		get(player).currentTime(get(srcStartTime));
		playerTime.set(get(srcStartTime));
	}

	get(player).src({
		src: get(playerSrc),
		type: get(playerSrcType)
	});

	setVTT();
}
