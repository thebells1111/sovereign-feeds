<script>
	import Header from './Header/PodcastListHeader.svelte';
	import ListTypeDisplay from './ListTypeDisplay.svelte';
	import SubscriptionList from './SubscriptionList.svelte';
	import PodcastSearch from './PodcastSearch.svelte';

	import { podcastSearchResults } from '$/editor';
	export let fromChapters = false;

	export let showSyncModal = false;
	export let syncText = 'confirm';
	export let isSyncing = false;
</script>

<div class="podcast-list">
	<div class="head">
		<Header />
		<ListTypeDisplay />
	</div>

	{#if $podcastSearchResults?.feeds}
		<PodcastSearch {fromChapters} />
	{:else}
		<SubscriptionList {fromChapters} bind:showSyncModal bind:syncText bind:isSyncing />
	{/if}
</div>

<style>
	.podcast-list {
		height: 100%;
		overflow: hidden;
		padding: 0;
		display: flex;
		flex-direction: column;
		padding-bottom: 8px;
	}
</style>
