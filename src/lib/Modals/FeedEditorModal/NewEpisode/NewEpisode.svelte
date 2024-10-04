<script>
	import Title from '$lib/Tags/EpisodeMetadata/components/Title.svelte';

	import { rssData } from '$/editor';
</script>

{#if $rssData}
	<Title />
{/if}

<style>
</style>
