<script>
	import ImageLoader from '$lib/Loaders/ImageLoader.svelte';

	import { podcastSearchResults, selectedPodcast } from '$/editor';

	export let handlePodcastSelect = () => {};

	let podcastBindings = [];
</script>

<ul>
	{#each ($podcastSearchResults && $podcastSearchResults?.feeds) || [] as podcast, index}
		<li
			data-id={podcast.id}
			data-_id={podcast._id}
			data-index={index}
			data-type="podcastList"
			bind:this={podcastBindings[index]}
			class="podcast-title"
			on:click={handlePodcastSelect.bind(null, podcast, index)}
		>
			<ImageLoader
				url={podcast?.artwork || podcast?.image}
				alt={`${podcast?.title} Logo`}
				title={podcast?.title}
				imageSize="50"
				styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
			/>
			<div class="title" class:selected={podcast.id === $selectedPodcast?.id}>
				{podcast?.title}
			</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
		height: calc(100% - 44px);
		overflow: auto;
		-webkit-user-select: none;
	}

	li {
		list-style-type: none;
	}

	.podcast-title {
		display: flex;
		align-items: center;
		overflow: hidden;
		width: 100%;
		padding: 4px;
		margin: 0;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid var(--border-color);
		height: auto;
	}
	.podcast-title:hover {
		background-color: var(--hover-color);
		background: linear-gradient(180deg, var(--selected-color) 33.333%, var(--hover-color) 100%);
	}

	.title {
		width: 100%;
	}
</style>
