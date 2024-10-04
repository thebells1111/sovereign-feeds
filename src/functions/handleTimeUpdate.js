import savePlayingPodcastState from '$functions/savePlayingPodcastState';

import {
	player,
	playerTime,
	playerRemainingTime,
	playingEpisodeChapters,
	chapterIndex,
	playingEpisodeTranscript,
	transcriptIndex,
	playerSaveTime,
	saveTimeInterval
} from '$/stores';

import { get } from 'svelte/store';

export default async function handleTimeUpdate({ save }) {
	playerTime.set(get(player).currentTime());
	playerRemainingTime.set(get(player).remainingTime());

	//updates the chapters images to current position
	while (get(playerTime) >= get(playingEpisodeChapters)?.[get(chapterIndex) + 1]?.startTime) {
		chapterIndex.update((n) => n + 1);
	}

	while (get(playerTime) < get(playingEpisodeChapters)?.[get(chapterIndex)]?.startTime) {
		chapterIndex.update((n) => n - 1);
	}

	while (get(playerTime) >= get(playingEpisodeTranscript)?.[get(transcriptIndex) + 1]?.start) {
		transcriptIndex.update((n) => n + 1);
	}

	while (get(playerTime) < get(playingEpisodeTranscript)?.[get(transcriptIndex)]?.start) {
		transcriptIndex.update((n) => n - 1);
	}

	if (get(playerSaveTime) < get(playerTime) || save) {
		savePlayingPodcastState();

		playerSaveTime.set(get(playerTime) + get(saveTimeInterval));
	}
}
