<script>
	import SocialInteract from './SocialInteract/SocialInteract.svelte';
	import { rssData, editingEpisode } from '$/editor';

	let type = 'episode';
</script>

{#if $editingEpisode?.['podcast:socialInteract']}
	<div class="container">
		<SocialInteract data={$editingEpisode && $editingEpisode['podcast:socialInteract']} />
	</div>
{/if}

<style>
	.container {
		width: 100%;
		display: flex;
	}
</style>
