<script>
	import { slide } from 'svelte/transition';

	import SettingsIcon from '$lib/icons/Settings.svelte';

	import {
		podcastList,
		mainPodcastList,
		seenEpisodesCounts,
		allSeenQuickDisplay,
		selectedPodcast,
		episodesList,
		filteredEpisodesList,
		podcastDB,
		podcastStateDB,
		rssEditor,
		rightPane
	} from '$/stores';

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'episodes-settings-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	async function deletePodcast() {
		const mainIndex = $mainPodcastList.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);

		const listIndex = $podcastList.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);

		$mainPodcastList.splice(mainIndex, 1);
		$podcastList.splice(listIndex, 1);

		$podcastList = $podcastList;

		podcastDB.removeItem(`${$selectedPodcast.id}`);
		delete $seenEpisodesCounts[$selectedPodcast.id];
		podcastStateDB.removeItem(`${$selectedPodcast.id}`);
	}

	async function markAllAsSeen() {
		$allSeenQuickDisplay = true;

		let podcast = await podcastDB.getItem($selectedPodcast.id);
		$seenEpisodesCounts[$selectedPodcast.id] = podcast.episodes.length;
		let storedPodcast = (await podcastStateDB.getItem(`${$selectedPodcast.id}`)) || {};
		let seenState = storedPodcast.seen || new Set();
		let episodes = podcast.episodes;
		for (const episode of episodes) {
			seenState.add(episode.id);
		}
		storedPodcast.seen = seenState;
		await podcastStateDB.setItem(`${$selectedPodcast.id}`, storedPodcast);
		//refreshes display
		$podcastList = $podcastList;
		if (`${$selectedPodcast.id}` === `${$selectedPodcast.id}`) {
			$episodesList = $episodesList;
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div>
	<button id="episodes-settings-button" aria-label="Episode Settings" on:click={handleSettingsClick}
		><SettingsIcon size="27px" color="#333" /></button
	>
	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li on:click={markAllAsSeen}>Mark Episodes As Seen</li>
			<li on:click={deletePodcast}>Delete Podcast</li>
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 30px;
	}
	ul {
		background-color: var(--tertiary-color);
		color: var(--text-color);
		border-radius: 3px;
		width: 200px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 36px;
		right: 4px;
		overflow: hidden;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		z-index: 3;
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 4px;
		line-height: 42px;
	}
	li:hover {
		background-color: var(--text-color);
		color: var(--tertiary-color);
	}

	button {
		background-color: transparent;
		margin: 0;
		padding: 0.25em;
		border: none;
		color: var(--text-color);
	}
</style>
