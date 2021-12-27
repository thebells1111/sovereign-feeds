<script>
	import PersonEditor from './PersonEditor.svelte';

	import { rssData, editingEpisode } from '$/editor';

	export let type = 'episode';
</script>

{#if $rssData && $editingEpisode['podcast:person']}
	<div>
		{#if type === 'episode'}
			<PersonEditor bind:data={$editingEpisode['podcast:person']} type={'episode'} />
		{:else if type === 'podcast'}
			<PersonEditor bind:data={$rssData['podcast:person']} type={'podcast'} />
		{/if}
	</div>
{/if}

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
