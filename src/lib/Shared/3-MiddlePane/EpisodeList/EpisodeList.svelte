<script>
	import Header from './Header/Header.svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import EpisodeListItem from './EpisodeListItem.svelte';
	import EpisodeListLoadingItems from './EpisodeListLoadingItems.svelte';

	import {
		selectedPodcast,
		selectedPodcastState,
		filteredEpisodesList,
		allSeenQuickDisplay,
		seenEpisodes,
		episodesVerticalSwiper
	} from '$/stores';

	let episodesOffset = 0;
	let yPosStart = 0;

	async function getStatus() {
		$allSeenQuickDisplay = true;
		//prevents NEW from flashing when changing podcast

		$seenEpisodes = $selectedPodcastState?.seen || new Set();
		$allSeenQuickDisplay = false;
	}

	$: getStatus($selectedPodcastState);
	export let listHeight = 500;
	export let sectionWidth;
	let scrollToIndex = 0;
</script>

{#if $selectedPodcast?.id}
	{#if $filteredEpisodesList && $filteredEpisodesList?.length}
		<div
			class="list-height"
			bind:clientHeight={listHeight}
			on:touchstart={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				yPosStart = touch.pageY;
				$episodesVerticalSwiper.allowTouchMove = false;
			}}
			on:touchmove={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				if (episodesOffset === 0 && yPosStart < touch.pageY) {
					$episodesVerticalSwiper.allowTouchMove = true;
				}
			}}
			on:touchend={() => {
				$episodesVerticalSwiper.allowTouchMove = true;
			}}
		>
			<VirtualList
				bind:height={listHeight}
				width="100%"
				{scrollToIndex}
				itemCount={$filteredEpisodesList.length}
				itemSize={$filteredEpisodesList.map((v) => {
					let charPerRow = Math.floor((sectionWidth - 86) / 10);
					let rows = Math.ceil(v.title.length / charPerRow) + 1;
					let titleHeight = 25 * rows;
					return titleHeight + 110;
				})}
				overscanCount={5}
				on:afterScroll={(e) => (episodesOffset = e.detail.offset)}
			>
				<div slot="item" let:index let:style {style} class="row">
					<EpisodeListItem episode={$filteredEpisodesList?.[index]} />
				</div>
			</VirtualList>
		</div>
	{:else}
		{#each [1, 2, 3, 4, 5] as episode}
			<EpisodeListLoadingItems />
		{/each}
	{/if}
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
</style>
