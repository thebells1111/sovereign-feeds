<script>
	import stripHtml from 'striptags';

	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import PlaylistAdd from '$lib/icons/PlaylistAdd.svelte';
	import EpisodeListItemOptions from './EpisodesListItemOptions.svelte';

	import loadEpisode from '$functions/loadEpisode';

	import prettyDate from '$functions/prettyDate';
	import { browser } from '$app/env';

	import {
		selectedPodcast,
		selectedEpisode,
		userStateDB,
		userState,
		showNotesPane,
		rightPane,
		seenEpisodesCounts,
		seenEpisodes,
		selectedPodcastState,
		podcastStateDB,
		playingPodcast,
		playingList,
		allSeenQuickDisplay,
		selectedPlayingList,
		playingEpisode,
		player,
		playerIsPaused,
		swiper,
		filteredEpisodesList,
		middlePane,
		showMobile,
		searchListPodcastSelected,
		showNotesVerticalSwiper,
		episodesVerticalSwiper
	} from '$/stores';

	export let episode;

	function markAsSeen(id) {
		if (!$searchListPodcastSelected) {
			$seenEpisodes.add(id);
			$seenEpisodesCounts[`${$selectedPodcast.id}`] = $seenEpisodes.size;
			$selectedPodcastState.seen = $seenEpisodes;

			podcastStateDB.setItem(`${$selectedPodcast.id}`, $selectedPodcastState);
		}
	}

	async function selectEpisode(episode, slide) {
		setTimeout(addTimeStamps, 100);

		function addTimeStamps() {
			console.log(document.querySelectorAll('.timestampLink'));
		}

		$rightPane = 'showNotes';

		if ($showNotesPane) {
			$showNotesPane.scrollTop = 0;
		}
		$selectedEpisode = episode;

		markAsSeen(episode.id);

		if (slide.panel === 0) {
			$swiper?.slideTo(0);
			$episodesVerticalSwiper?.slideTo(0);
			$showNotesVerticalSwiper?.slideTo(0);
			$swiper.allowTouchMove = true;
			$episodesVerticalSwiper.allowTouchMove = false;
			$showNotesVerticalSwiper.allowTouchMove = false;
		} else {
			$showNotesVerticalSwiper?.slideTo(1);
		}
	}

	async function startEpisode(episode) {
		let id = episode.id;
		selectEpisode(episode, { panel: 0 });
		$playingList = $playingPodcast?.episodes;
		$selectedPlayingList = 'episodes';
		$playingList = $filteredEpisodesList;

		if (
			$playingPodcast?.title === $selectedPodcast?.title &&
			$playingEpisode?.title === episode?.title
		) {
			if (!$playerIsPaused) {
				$player.pause();
			} else {
				$player.play();
			}
		} else {
			await markAsSeen(id);
			loadEpisode(episode, $selectedPodcast, 'episodes');
			if (!$showMobile) {
				$middlePane = 'nowPlaying';
			}
		}
	}

	function makeSnippet(string) {
		if (typeof string === 'string') {
			let s = stripTags(decode(string)).substring(0, 105);
			return `${s.substr(0, s.lastIndexOf(' '))} ...`;
		}
		return '';

		function decode(str) {
			return str.replace(/&#(\d+);/g, function (match, dec) {
				return String.fromCharCode(dec);
			});
		}
		function stripTags(str) {
			return str.replace(/(<([^>]+)>)/gi, '');
		}
	}

	function addToPlaylist(episode) {
		let id = episode.id;
		$rightPane = 'playlist';
		$userState.playlist = $userState.playlist || [];

		episode = { ...episode };
		episode.podcast = {
			id: $selectedPodcast.id,
			title: $selectedPodcast.title,
			artwork: $selectedPodcast.artwork
		};
		$userState.playlist.push(episode);
		$userState = $userState;
		userStateDB.setItem('userState', $userState);
		markAsSeen(id);
	}

	function download(audioFileUrl) {
		fetch(audioFileUrl).then(function (res) {
			res.blob().then(function (blob) {
				var size = blob.size;
				var type = blob.type;

				var reader = new FileReader();
				reader.addEventListener('loadend', async function () {
					// console.log('reader.result:', reader.result);

					// 1: play the base64 encoded data directly works
					// audioControl.src = reader.result;

					// 2: Serialize the data to localStorage and read it back then play...
					var base64FileData = reader.result.toString();

					var mediaFile = {
						fileUrl: audioFileUrl,
						size: blob.size,
						type: blob.type,
						src: base64FileData
					};

					// save the file info to localStorage
					podcastStateDB.setItem('myTest', JSON.stringify(mediaFile));

					// read out the file info from localStorage again
					var reReadItem = await podcastStateDB.getItem('myTest');

					console.log(reReadItem);
				});

				reader.readAsDataURL(blob);
			});
		});
	}
</script>

<div
	class="container"
	on:dblclick={startEpisode.bind(this, episode)}
	class:selected={episode === $selectedEpisode}
>
	<button
		class="load-episode-button  episode-button"
		on:click={startEpisode.bind(this, episode)}
		aria-label="Load Episode"
	>
		{#if $playingPodcast?.title === $selectedPodcast?.title && $playingEpisode?.title === episode?.title && !$playerIsPaused}
			<Pause size="36px" />
		{:else}
			<PlayArrow size="36px" />
		{/if}
	</button>
	<div on:click={selectEpisode.bind(this, episode, { panel: 3 })} class="description">
		<div class="head">
			<h1>{episode?.title}</h1>
			<div>
				{#if episode?.datePublished}
					<p>{prettyDate(episode?.datePublished)}</p>
				{/if}
			</div>
		</div>
		<div>
			<p>{makeSnippet(stripHtml(episode?.description))}</p>
		</div>
	</div>
	<div class="episode-right">
		<div class="text-block">
			{#if !$seenEpisodes.has(episode.id) && !$allSeenQuickDisplay && !$searchListPodcastSelected}
				NEW
			{/if}
		</div>

		<!-- <button on:click={download.bind(this, episode.enclosureUrl)}>D</button> -->

		<button
			class="add-button episode-button"
			on:click={addToPlaylist.bind(this, episode)}
			aria-label="Add Episode"><PlaylistAdd size="30px" /></button
		>
		<EpisodeListItemOptions {episode} />
	</div>
</div>

<style>
	.container {
		height: 100%;
		margin: 0;
		padding: 0 8px;
		border-bottom: 1px solid var(--border-color);
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.container.selected {
		background-color: var(--selected-color);
		background: linear-gradient(180deg, var(--secondary-color) 33.333%, var(--selected-color) 100%);
	}
	.container:hover {
		background-color: var(--hover-color);
		background: linear-gradient(180deg, var(--selected-color) 33.333%, var(--hover-color) 100%);
	}
	.container.selected {
		color: var(--accent-color-red);
	}

	.description {
		width: 100%;
	}

	:global(p) {
		height: auto;
		padding: 0 0 1em 0.75em;
		margin: 0;
	}

	h1 {
		width: 100%;
		margin: 0.5em 0 0.125em 0;
		font-size: 1.17em;
		font-weight: bolder;
	}

	.head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.head > div {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.head > div > p {
		font-size: 0.8em;
		margin: 0 1em;
	}

	.episode-right {
		display: flex;
		flex-direction: column;
		width: 42px;
		margin: 0 1em;
		align-content: center;
		justify-content: center;
		position: relative;
	}

	.text-block {
		width: 100%;
		height: 15px;
		margin: 0;
		padding: 0;
		text-align: end;
		position: absolute;
		top: 0;
	}

	.episode-button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		transform: scale(1);
		transition-duration: 0.2s;
	}

	.episode-button:hover {
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
