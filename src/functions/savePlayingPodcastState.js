import {
	playingPodcastState,
	playingEpisode,
	userState,
	playerTime,
	userStateDB,
	podcastStateDB,
	playingPodcast,
	playingEpisodeState
} from '$/stores';
import { get } from 'svelte/store';

export default function savePlayingPodcastState(source) {
	// console.log('-----------------------------');
	// console.log(get(playingPodcast));
	// console.log(get(playingPodcastState));
	try {
		let $playingPodcast = get(playingPodcast);
		let $playingEpisodeState = get(playingEpisodeState);
		let $playingPodcastState = get(playingPodcastState);
		let $userState = get(userState);
		let $playerTime = get(playerTime);
		let $playingEpisode = get(playingEpisode);

		$userState.playing.episodeState.time = $playerTime;
		userStateDB.setItem('userState', $userState);

		$playingEpisodeState.time = $playerTime;

		//selected the playing episode object and update it to reflect the current state

		$playingPodcastState[$playingEpisode.id] = { ...$playingEpisodeState };
		// console.log('id: ', $playingEpisode.id);
		// console.log($playingPodcastState[$playingEpisode.id]);

		delete $playingPodcastState['undefined'];
		playingPodcastState.set($playingPodcastState);

		podcastStateDB.setItem(`${$playingPodcast.id}`, $playingPodcastState);
	} catch {
		(err) => console.log(err);
	}
}
