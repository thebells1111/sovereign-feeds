<script>
	import {
		selectedPodcast,
		playingPodcast,
		episodesList,
		filteredEpisodesList,
		playingList,
		imageProxy,
		mainPodcastList,
		rssEditor,
		togglePreview,
		showCreateEpisode
	} from '$/stores';

	import Settings from './Settings.svelte';
	import Subscribe from './Subscribe.svelte';
	import EpisodeSorter from './EpisodeSorter.svelte';
	import EpisodeFilter from './EpisodeFilter.svelte';
	import PiggyBank from '$lib/icons/PiggyBank.svelte';
	import FFCreator from './FFCreator.svelte';
	import Image from '$functions/Image.svelte';

	let filterText = '';
	let gradient;

	function handleFilterTextInput() {
		$filteredEpisodesList = $episodesList.filter(
			(episode) =>
				episode.title.toLowerCase().includes(filterText.toLowerCase()) ||
				episode.description.toLowerCase().includes(filterText.toLowerCase())
		);
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList;
		}
	}

	function handleFilterTextSelect() {
		filterText = '';
		$filteredEpisodesList = $episodesList;
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList;
		}
	}

	let titleHeight;
	export let headerHeight;

	function handleImageErr(e) {
		// console.log(e);
	}
</script>

<header bind:clientHeight={headerHeight}>
	<div class="top-bar">
		<div class="logo">
			{#if $selectedPodcast}
				<Image
					src={$selectedPodcast.artwork}
					alt={$selectedPodcast.title}
					style={`width: 80px; height: 80px;	border-radius: 5px;`}
				/>
			{/if}
		</div>
		<div class="title">
			<div bind:clientHeight={titleHeight}>
				<div class="search-icon"><Settings /></div>
				<h1>{$selectedPodcast?.title}</h1>
			</div>
		</div>
	</div>

	<div class="filter-box" class:long-title={titleHeight > 32}>
		<input
			type="text"
			bind:value={filterText}
			placeholder="search episodes"
			on:input={handleFilterTextInput}
			on:focus={handleFilterTextSelect}
		/>
	</div>
	<div class="bottom-bar">
		{#if !$rssEditor}
			{#if $mainPodcastList.findIndex(({ id }) => id === $selectedPodcast?.id) > -1}
				<EpisodeFilter />
			{:else}
				<Subscribe />
			{/if}
		{:else}
			<button
				class="primary"
				on:click={() => {
					$togglePreview = !$togglePreview;
				}}>Toggle Editor</button
			>
		{/if}
		<!-- {#if $selectedPodcast?.funding?.url}
      <a href={$selectedPodcast?.funding?.url}>
        <PiggyBank size="32px" />
      </a>
    {/if} -->
		<FFCreator />
		{#if !$rssEditor}
			<EpisodeSorter />
		{:else}
			<button class="primary" on:click={() => ($showCreateEpisode = true)}>New Episode</button>
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
		bottom: 58px;
	}

	.long-title {
		position: relative;
		width: 100%;
		bottom: 0px;
	}

	input {
		width: calc(100% - 8px);
		outline: none;
		text-align: center;
		margin: 0;
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
</style>
