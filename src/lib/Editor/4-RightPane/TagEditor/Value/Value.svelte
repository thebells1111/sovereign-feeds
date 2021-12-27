<script>
	import SharedValueComponent from './SharedValueComponent.svelte';

	import { rssData, editingEpisode } from '$/editor';

	export let type = 'episode';
</script>

{#if $rssData}
	{#if type === 'episode'}
		<SharedValueComponent bind:data={$editingEpisode['podcast:value']} />
	{:else if type === 'podcast'}
		<SharedValueComponent bind:data={$rssData['podcast:value']} />
	{/if}
{/if}

<style>
</style>
