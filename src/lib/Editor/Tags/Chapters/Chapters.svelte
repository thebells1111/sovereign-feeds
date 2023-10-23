<script>
	import { goto } from '$app/navigation';
	import BoostagramChapters from './BoostagramChapters.svelte';

	import { editingEpisode, rssData, tagHeaders, selectedPodcast } from '$/editor';
</script>

{#if $rssData}
	<header>
		<div>
			<h4>{$tagHeaders.chapters.url}</h4>
		</div>

		<input type="text" bind:value={$editingEpisode['podcast:chapters']['@_url']} />
		{#if !($selectedPodcast?.url === 'https://sovereignfeeds.com/blankfeed.xml' || !$editingEpisode?.enclosure?.['@_url'])}
			<button
				class="primary"
				on:click={() => {
					goto(
						`/chapters/${encodeURIComponent($selectedPodcast?.url)}/${encodeURIComponent(
							$editingEpisode?.enclosure?.['@_url']
						)}`
					);
				}}
			>
				View Chapters
			</button>
		{/if}
		<BoostagramChapters />
	</header>
{/if}

<style>
	header {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding-right: 8px;
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

	button {
		align-self: flex-end;
	}
</style>
