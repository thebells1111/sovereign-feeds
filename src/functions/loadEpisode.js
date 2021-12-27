import loadSrc from '$functions/loadSrc';

import {
	selectedPlayingList,
	srcStartTime,
	srcStopTime,
	chapterIndex,
	transcriptIndex,
	selectedEpisodeTranscript,
	playingEpisode,
	userState,
	playingPodcast,
	podcastDB,
	player,
	playingEpisodeTranscript,
	playerIsPaused
} from '$/stores';

import { get } from 'svelte/store';

export default async function loadEpisode(episode, podcast, playingList) {
	selectedPlayingList.set(playingList);
	srcStartTime.set(undefined);
	srcStopTime.set(undefined);
	chapterIndex.set(0);
	transcriptIndex.set(0);
	playingEpisodeTranscript.set(get(selectedEpisodeTranscript));

	playingEpisode.set(episode);
	userState.update((v) => {
		v.playing.episode = episode;
		return v;
	});

	if (playingList === 'playlist') {
		playingPodcast.set(await podcastDB.getItem(`${episode.podcast.id}`));
	} else {
		playingPodcast.set(podcast);
	}
	loadSrc();
	get(player).play();
	playerIsPaused.set(false);
}
