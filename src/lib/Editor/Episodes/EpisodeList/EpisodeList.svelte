<script>
	import Header from './Header/Header.svelte';
	import MobileHeader from './Header/MobileHeader.svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import EpisodeListItem from './EpisodeListItem.svelte';
	import EpisodeListLoadingItems from './EpisodeListLoadingItems.svelte';
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import EpisodeSorter from './EpisodeSorter.svelte';

	import {
		episodesList,
		selectedPodcast,
		filteredEpisodesList,
		maxEpisodes,
		showLiveEpisodes
	} from '$/editor';

	$: if ($episodesList) {
		$filteredEpisodesList = $episodesList.slice(0, $maxEpisodes);
	}

	export let fromChapters = false;
	let listHeight = 500;
	let headerHeight = 80;
	let sectionHeight;
	let sectionWidth;
	let virtualList;
	let scrollToIndex = 0;
	$: if (sectionHeight && headerHeight) {
		listHeight = sectionHeight - headerHeight;
	}

	let showEpisodeSorter = true;

	$: console.log($selectedPodcast);
</script>

{#if $selectedPodcast?.id}
	<section bind:clientHeight={sectionHeight} bind:clientWidth={sectionWidth}>
		{#if fromChapters}
			<MobileHeader bind:headerHeight />
		{:else}
			<Header bind:headerHeight bind:showEpisodeSorter />
		{/if}
		{#if $filteredEpisodesList && $filteredEpisodesList?.length}
			<div class="list-height">
				<VirtualList
					bind:this={virtualList}
					bind:height={listHeight}
					width="100%"
					{scrollToIndex}
					itemCount={$filteredEpisodesList.length}
					itemSize={$filteredEpisodesList.map((v) => {
						let charPerRow = Math.floor((sectionWidth - 86) / 10);
						let rows = Math.ceil((v?.title.length || 0) / charPerRow) + 1;
						let titleHeight = 25 * rows;
						return titleHeight + 110;
					})}
					overscanCount={5}
				>
					<div slot="item" let:index let:style {style} class="row">
						<EpisodeListItem
							episode={$filteredEpisodesList?.[index]}
							episodeIndex={index}
							{fromChapters}
						/>
					</div>
				</VirtualList>
			</div>
		{:else}
			{#each [1, 2, 3, 4, 5] as episode}
				<EpisodeListLoadingItems />
			{/each}
		{/if}
	</section>
{/if}

{#if showEpisodeSorter && $episodesList?.length > 1}
	<Modal
		bind:showModal={showEpisodeSorter}
		onClose={() => {
			$selectedPodcast.item = $episodesList;
			$episodesList = $episodesList;
		}}
	>
		<EpisodeSorter bind:episodes={$episodesList} />
	</Modal>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	:global(.virtual-list-wrapper) {
		overflow-x: hidden !important;
	}

	p {
		font-size: 1.2em;
		font-weight: 600;
		text-align: center;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
