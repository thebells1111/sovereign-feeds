<script>
	import DownloadRSS from './DownloadRSS.svelte';
	import ServerPush from './ServerPush.svelte';
	import DigitalOceanPush from './DigitalOceanPush.svelte';
	import AddFeed from './AddFeed.svelte';
	import SortEpisodes from './SortEpisodes.svelte';
	import { selectedPodcast, rssData, digitalOceanEnabled } from '$/editor';
</script>

<ServerPush />
<div class="split" />
<DownloadRSS />
<div class="split" />
{#if $digitalOceanEnabled}
	<DigitalOceanPush />
	<div class="split" />
{/if}

{#if $selectedPodcast.id === 'new'}
	<AddFeed />
	<div class="split" />
{/if}

{#if $rssData?.['podcast:medium'] === 'music'}
	<SortEpisodes />

	<div class="split" />
{/if}

<style>
	.split {
		margin: 24px 8px;
		width: calc(100% - 16px);
		border: 1px solid gray;
	}
</style>
