<script>
	import SharedImageComponent from './SharedImageComponent.svelte';

	import { rssData, editingEpisode } from '$/editor';

	export let type = 'episode';
</script>

{#if $rssData}
	<div>
		{#if type === 'episode'}
			<SharedImageComponent bind:data={$editingEpisode['podcast:aspectImages']} />
		{:else}
			<SharedImageComponent bind:data={$rssData['podcast:aspectImages']} />
		{/if}
	</div>
{/if}

<style>
	div {
		width: 100%;
	}
</style>
