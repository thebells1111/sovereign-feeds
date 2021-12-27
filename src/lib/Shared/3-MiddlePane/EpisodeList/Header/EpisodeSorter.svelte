<script>
	import { slide } from 'svelte/transition';
	import sortEpisodes from '$functions/sortEpisodes';

	import {
		selectedPodcast,
		filteredEpisodesList,
		playingList,
		playingPodcast,
		selectedPodcastState,
		podcastStateDB,
		episodeSelector,
		selectedPlayingList
	} from '$/stores';

	let selectedSorter = $episodeSelector.sorter;
	let completeStatus = false;

	function handleSorterChange(sortType) {
		selectedSorter = $episodeSelector.sorter = sortType;
		$selectedPodcastState.episodeSorter = selectedSorter;
		$filteredEpisodesList = sortEpisodes($filteredEpisodesList, selectedSorter, {
			complete: $episodeSelector.completeStatus
		});

		podcastStateDB.setItem(`${$selectedPodcast.id}`, $selectedPodcastState);
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList; //reloads to clear completed episodes
		}
	}

	$: if ($selectedPodcastState) {
		selectedSorter = $episodeSelector.sorter;
		// $filteredEpisodesList = sortEpisodes(
		//   $filteredEpisodesList,
		//   selectedSorter,
		//   { complete: $episodeSelector.completeStatus }
		// );
		// if (
		//   $selectedPodcast?.id === $playingPodcast.id &&
		//   selectedPlayingList === 'episodes'
		// ) {
		//   $playingList = $filteredEpisodesList;
		// }
	}

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'episodes-sorter-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="sorter">
	<button id="episodes-sorter-button" on:click={handleSettingsClick}>
		{`sort by ${selectedSorter}`}
	</button>

	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li on:click={handleSorterChange.bind(this, 'newest')}>newest</li>
			<li on:click={handleSorterChange.bind(this, 'oldest')}>oldest</li>
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 36px;
		padding: 0;
		margin-right: 8px;
	}
	ul {
		background-color: var(--tertiary-color);
		color: var(--text-color);
		border-radius: 3px;
		width: 122px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 40px;
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
		border: 1px solid var(--border-color);
		color: #333;
		padding: 0 16px;
		height: 35.78px;
	}
</style>
