<script>
	import Title from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Title.svelte';

	import { rssData } from '$/editor';
</script>

{#if $rssData}
	<Title />
{/if}

<style>
</style>
