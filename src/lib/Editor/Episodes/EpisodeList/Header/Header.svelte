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
	import { bind } from 'svelte/internal';

	let titleHeight;
	export let headerHeight;

	function handleLiveToggle(liveStatus) {
		$showLiveEpisodes = liveStatus || false;
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
				<h1>{$rssData?.title}</h1>
			</div>
		</div>
	</div>

	<div class="filter-box" class:long-title={titleHeight > 32}>
		<h3 on:click={handleLiveToggle.bind(this, false)} class:active={!$showLiveEpisodes}>
			Regular Episodes
		</h3>
		<h3 on:click={handleLiveToggle.bind(this, true)} class:active={$showLiveEpisodes}>
			Live Episodes
		</h3>
	</div>
	<div class="bottom-bar">
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

		<label class="max-episodes"
			>Max Episodes<NumberInput
				max={1000}
				min={1}
				value={$maxEpisodes}
				blurDefault={$maxEpisodes}
			/></label
		>

		<button class="primary create" on:click={() => ($showCreateEpisode = true)}
			>{$newEpisodeHeaders.newEps}</button
		>
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
		bottom: 77px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.long-title {
		position: relative;
		width: 100%;
		bottom: 0px;
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 4px 0;
		min-height: 50px;
	}

	h1 {
		margin: 0;
		display: inline;
	}
	.max-episodes {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.create {
		padding-right: 8px;
	}

	h3 {
		margin: 0;
		cursor: pointer;
		user-select: none;
	}
	.active {
		color: hsla(352, 100%, 33%, 1);
		border-bottom: 2px solid hsla(352, 100%, 33%, 1);
	}
</style>
