<script>
	import { slide } from 'svelte/transition';

	import {
		selectedPodcast,
		selectedPodcastState,
		podcastDB,
		podcastStateDB,
		seenEpisodes,
		seenEpisodesCounts,
		podcastList,
		episodesList
	} from '$/stores';

	export let episode;

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== `episode-list-option-button-${episode.id}`) {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	async function markComplete(episode) {
		let id = episode.id;

		let episodeState = $selectedPodcastState[id] || [];
		episodeState.time = 0.0;
		episodeState.complete = true;

		$selectedPodcastState[id] = episodeState;

		$seenEpisodes.add(id);

		$seenEpisodesCounts[`${$selectedPodcast.id}`] = $seenEpisodes.size;
		$selectedPodcastState.seen = $seenEpisodes;
		$selectedPodcastState = $selectedPodcastState; //reloads to clear completed episodes

		await podcastStateDB.setItem(`${$selectedPodcast.id}`, $selectedPodcastState);
	}

	async function markAsUnseen(episode) {
		let storedPodcast = (await podcastStateDB.getItem(`${$selectedPodcast.id}`)) || {};

		let seenState = storedPodcast.seen || new Set();
		let id = episode.id;
		seenState.delete(id);

		storedPodcast.seen = seenState;
		await podcastStateDB.setItem(`${$selectedPodcast.id}`, storedPodcast);
		//refreshes display
		$podcastList = $podcastList;
	}

	async function deleteEpisode(episode) {
		let index = $selectedPodcast.episodes.findIndex(({ id }) => id === episode.id);
		console.log(index);

		$selectedPodcast.episodes.splice(index, 1);
		console.log($selectedPodcast.episodes);
		$episodesList = [...$selectedPodcast.episodes];
		markAsUnseen(episode);
		podcastDB.setItem($selectedPodcast.id, $selectedPodcast);
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="episode-list-options" on:click={handleSettingsClick}>
	<button id={`episode-list-option-button-${episode.id || ''}`}>
		<div>...</div>
	</button>
	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li on:click={markComplete.bind(this, episode)}>mark episode complete</li>
			<!-- <li on:click={markAsUnseen.bind(this, episode)}>mark episode unseen</li> -->
			<!-- <li on:click={deleteEpisode.bind(this, episode)}>delete episode</li> -->
		</ul>
	{/if}
</div>

<style>
	.episode-list-options {
		position: absolute;
		padding: 1em;
		bottom: -10px;
		right: -32px;
	}
	ul {
		background-color: var(--tertiary-color);
		border-radius: 3px;
		width: 175px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		bottom: 22px;
		right: 42px;
		overflow: hidden;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		z-index: 3;
		-webkit-user-select: none; /* Safari */
		user-select: none; /* Standard syntax */
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 4px;
		line-height: 42px;
	}
	li:hover {
		background-color: #333;
		color: var(--text-color-light);
	}

	button {
		margin: 0;
		color: var(--text-color-light);
		padding: 0;
		margin: 0;
		height: 1.1em;
		width: 1.1em;
		border-radius: 1em;
		font-size: 1.25em;
		font-weight: 700;
		position: relative;
		background-color: var(--icon-color);
	}

	button:active,
	button:hover {
		color: var(--text-color-light);
		transform: scale(1.2);
		transition-duration: 0.2s;
	}

	button > div {
		height: 1em;
		position: relative;
		bottom: 0.33em;
	}
</style>
