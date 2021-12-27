<script>
	import Author from './Components/Author/Author.svelte';
	import { rssData, selectedPodcast, tagHeaders, podcastList } from '$/editor';

	$: if ($selectedPodcast && $rssData) {
		if ($rssData?.['itunes:owner']) {
			$rssData['itunes:owner'] = $rssData?.['itunes:owner']
				? $rssData['itunes:owner']
				: { 'itunes:email': '', 'itunes:name': '' };
		} else {
			$rssData['itunes:owner'] = { 'itunes:email': '', 'itunes:name': '' };
		}
	}
</script>

{#if $rssData}
	<Author />
	<label>
		<h3>{$tagHeaders.podcast.editor}</h3>
		<input type="text" bind:value={$rssData['managingEditor']} />
	</label>
	<h3>{$tagHeaders.podcast.owner}</h3>
	<label>
		<h4>Name:</h4>
		<input type="text" bind:value={$rssData['itunes:owner']['itunes:name']} />
	</label>
	<label>
		<h4>E-mail</h4>
		<input type="email" bind:value={$rssData['itunes:owner']['itunes:email']} />
	</label>
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
