<script>
	import TranscriptBlock from './TranscriptBlock.svelte';
	import { rssData, editingEpisode } from '$/editor';
</script>

{#if $rssData && $editingEpisode?.['podcast:transcript']}
	<TranscriptBlock data={$editingEpisode && $editingEpisode?.['podcast:transcript']} />
{/if}

<style>
</style>
