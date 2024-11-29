<script>
	import { editingEpisode, rssData } from '$/editor';
	import BoostagramChapters from '$lib/Tags/Chapters/BoostagramChapters.svelte';

	let blankChapters = {
		'@_type': 'application/json',
		'@_url': ''
	};

	let chapters;

	$: if ($editingEpisode) {
		chapters = $editingEpisode['podcast:chapters']
			? $editingEpisode?.['podcast:chapters']
			: blankChapters;
	}
</script>

{#if $rssData}
	<header>
		<div>
			<h4>Chapters File URL:</h4>
			<!-- <button on:click={loadChapters}> Load Chapters </button> -->
		</div>

		<input type="text" bind:value={chapters['@_url']} />
	</header>

	<BoostagramChapters />
{/if}

<style>
	header {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-bottom: 8px;
	}

	header > div {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	input {
		width: 100%;
		padding: 8px;
	}
</style>
