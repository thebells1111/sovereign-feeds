<script>
	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Image from '$functions/Image.svelte';

	import savePlayingPodcastState from '$functions/savePlayingPodcastState';
	import loadEpisode from '$functions/loadEpisode';

	import {
		selectedPodcast,
		selectedEpisode,
		selectedPlayingList,
		playingEpisode,
		playingPodcast,
		playerIsPaused,
		player,
		showMobile,
		middlePane,
		swiper,
		episodesVerticalSwiper,
		showNotesVerticalSwiper
	} from '$/stores';

	async function startEpisode() {
		let podcast = $selectedPodcast;

		if ($selectedPlayingList === 'playlist') {
			podcast = $selectedEpisode.podcast;
		}

		if (
			$playingPodcast.title === podcast.title &&
			$playingEpisode.title === $selectedEpisode.title
		) {
			if ($player.paused()) {
				$player.play();
				$player.userActive(false);
				$playerIsPaused = false;
			} else {
				$player.pause();
				$player.userActive(true);
				$playerIsPaused = true;
				savePlayingPodcastState('showNotes startEpisode');
			}
		} else {
			loadEpisode($selectedEpisode, podcast, $selectedPlayingList);
			if ($showMobile) {
				$swiper?.slideTo(0);
				$episodesVerticalSwiper?.slideTo(0);
				$showNotesVerticalSwiper?.slideTo(0);
				$swiper.allowTouchMove = true;
				$episodesVerticalSwiper.allowTouchMove = false;
				$showNotesVerticalSwiper.allowTouchMove = false;
			} else {
				$middlePane = 'nowPlaying';
			}
		}
	}

	let persons = [];

	$: if ($selectedEpisode) {
		persons = [];
		let p = false;
		if ($selectedEpisode.podcastPerson) {
			p = true;
			if ($selectedEpisode.podcastPerson.length) {
				persons = $selectedEpisode.podcastPerson;
			} else {
				persons = [$selectedEpisode.podcastPerson];
			}
		}

		if (p) {
			let temp = [];
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					temp = $selectedEpisode.person;
				} else {
					temp = [$selectedEpisode.person];
				}

				for (let p of persons) {
					if (temp.findIndex(({ img }) => img === p.img) === -1) {
						temp.push(p);
					}
				}
				persons = [...temp];
			}
		} else {
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					persons = $selectedEpisode.person;
				} else {
					persons = [$selectedEpisode.person];
				}
			}
		}
	}

	function handleImgError(e) {
		let elem = e.target;
		elem.parentNode.removeChild(elem);
	}

	let imageSizer = '&w=480&h=480';
</script>

<head>
	{#if $selectedEpisode?.title}
		<Image
			src={$selectedEpisode.image || $selectedPodcast.image || $selectedPodcast.artwork}
			style={`height: 100px; border-radius: 5px;`}
		/>

		<button class="shownotes-load-episode-button" on:click={startEpisode}>
			{#if $playingPodcast?.title === $selectedPodcast?.title && $playingEpisode?.title === $selectedEpisode?.title && !$playerIsPaused}<Pause
					size="36px"
				/>{:else}<PlayArrow size="36px" />
			{/if}
		</button>
		<h3>{$selectedEpisode.title}</h3>
	{/if}
</head>

<style>
	head {
		display: flex;
		position: relative;
		align-items: flex-start;
		padding: 8px 8px 0 8px;
		height: 100px;
	}

	h3 {
		min-height: 42px;
		margin: 0;
		text-align: center;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
	}

	:global(.shownotes-load-episode-button:hover > svg) {
		color: #111;
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
