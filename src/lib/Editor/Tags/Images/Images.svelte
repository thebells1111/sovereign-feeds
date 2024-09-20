<script>
	import SharedImageComponent from './SharedImageComponent.svelte';

	import { rssData, editingEpisode } from '$/editor';

	export let type = 'episode';
</script>

{#if $rssData}
	<div>
		{#if type === 'episode'}
			<SharedImageComponent bind:data={$editingEpisode['experimental:images']} />
		{:else}
			<SharedImageComponent bind:data={$rssData['experimental:images']} />
		{/if}
	</div>
{/if}

<style>
	div {
		width: 100%;
	}
</style>
