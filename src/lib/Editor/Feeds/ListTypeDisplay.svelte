<script>
	import { podcastSearchResults } from '$/editor';
</script>

<div class="progress-bar-container">
	{#if $podcastSearchResults && $podcastSearchResults.cat}
		<button on:click={() => ($podcastSearchResults = {})}>🠠 back to favorites</button>
	{:else}
		<p class="list-type">Favorite Podcasts</p>
	{/if}
</div>

<style>
	.progress-bar-container {
		height: 32px;
		position: relative;
		border-radius: 7px;
		margin-bottom: 1px;
		padding-right: 0.25em;
	}

	.list-type {
		font-size: 12px;
		width: 100%;
		font-weight: 700;
		text-align: center;
		margin: 0;
		padding: 0;
		position: absolute;
		bottom: 2px;
	}

	button {
		width: 100%;
		outline: none;
		background-color: transparent;
		border: none;
		text-align: left;
		padding-left: 8px;
	}
</style>
