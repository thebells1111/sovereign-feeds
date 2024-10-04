<script>
	import NumberInput from './NumberInput.svelte';
	import { showCreateEpisode } from '$/stores';
	import initializeEpisode from '../../../_functions/initializeEpisode';

	import {
		podcastList,
		selectedPodcast,
		episodesList,
		filteredEpisodesList,
		editorDB,
		podcastSearchResults,
		maxEpisodes,
		rssData,
		editingEpisode,
		showLiveEpisodes,
		rightPane,
		regularEpisodes,
		liveEpisodes,
		newEpisodeHeaders
	} from '$/editor';

	import Settings from './Settings.svelte';
	import Image from '$functions/Image.svelte';

	let titleHeight;
	export let headerHeight;

	function handleLiveToggle() {
		if ($showLiveEpisodes) {
			$episodesList = $liveEpisodes;
			initializeEpisode($liveEpisodes[0], 'live');
			$editingEpisode = $liveEpisodes[0];
			$rightPane = 'liveItem';
		} else {
			$episodesList = $regularEpisodes;
			initializeEpisode($regularEpisodes[0]);
			$editingEpisode = $regularEpisodes[0];
			$rightPane = 'episodeMetadata';
		}
	}
</script>

<header bind:clientHeight={headerHeight}>
	<div class="top-bar">
		<div class="logo">
			{#if $rssData}
				<Image
					src={$rssData['itunes:image']['@_href'] || ''}
					alt={$rssData.title}
					style={`width: 80px; height: 80px;	border-radius: 5px;`}
				/>
			{/if}
		</div>
		<div class="title">
			<div bind:clientHeight={titleHeight}>
				<div class="search-icon"><Settings /></div>
				<h1>{$rssData?.title || $selectedPodcast.title}</h1>
			</div>
		</div>
	</div>

	<div class="filter-box" class:long-title={titleHeight > 32}>
		{#if $podcastList && $podcastList.findIndex(({ id }) => id === $selectedPodcast.id) === -1}
			<button
				class="primary"
				on:click={async () => {
					$podcastList.push($selectedPodcast);
					$podcastList = $podcastList;
					let favs = (await editorDB.getItem('favorites')) || [];
					favs.push($selectedPodcast);
					editorDB.setItem('favorites', favs);
					$podcastSearchResults = {};
				}}>Add to Favorites</button
			>
		{/if}
	</div>
</header>

<style>
	header {
		position: relative;
		margin-left: 8px;
	}

	.top-bar {
		display: flex;
		margin-bottom: 4px;
	}

	.logo {
		width: 80px;
		height: 80px;
		display: inline-block;
	}

	.title {
		width: 100%;
		margin-left: 4px;
		position: relative;
	}

	.search-icon {
		float: right;
	}

	.filter-box {
		position: absolute;
		width: calc(100% - 84px);
		right: 0px;
		bottom: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.long-title {
		position: relative;
		width: 100%;
		bottom: 0px;
	}

	h1 {
		margin: 0;
		display: inline;
	}
</style>
