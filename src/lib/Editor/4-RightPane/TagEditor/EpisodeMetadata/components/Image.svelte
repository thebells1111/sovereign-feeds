<script>
	import {
		editingEpisode,
		rssData,
		podcastList,
		selectedPodcast,
		tagHeaders,
		digitalOceanEnabled
	} from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
	import Upload from '$lib/Upload/Upload.svelte';

	function handleInput(e) {
		$editingEpisode['itunes:image']['@_href'] = e.target.value;
		$editingEpisode['podcast:images']['@_srcset'][0].url = e.target.value;
	}

	let showUpload = false;
	let fileName;
	$: if (fileName) {
		handleInput({ target: { value: fileName } });
	}
</script>

<div class="episode-image">
	<label>
		<div>
			<div class="left">
				<h3>{$tagHeaders.episodes.imageUrl}</h3>
				{#if $digitalOceanEnabled}
					<button
						class="fancy"
						on:click={() => {
							showUpload = true;
						}}
					>
						Upload
					</button>
				{/if}
			</div>
			<button
				class="fancy"
				on:click={() => {
					$rssData['itunes:image']['@_href'] = $editingEpisode['itunes:image']['@_href'];
					$rssData['podcast:images']['@_srcset'][0].url = $editingEpisode['itunes:image']['@_href'];
					$selectedPodcast.artwork = $editingEpisode['itunes:image']['@_href'];
					$podcastList = $podcastList;
				}}>Sync Show Art</button
			>
		</div>
		<input
			type="text"
			bind:value={$editingEpisode['itunes:image']['@_href']}
			on:input={handleInput}
			use:selectTextOnFocus
		/>
	</label>

	<img src={$editingEpisode?.['itunes:image']?.['@_href']} style="height: 75px; width: 75px" />
	{#if showUpload}
		<Upload path={`${$editingEpisode.title}/art`} bind:fileName bind:showUpload />
	{/if}
</div>

<style>
	.episode-image {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0 12px 0 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.left {
		display: flex;
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	label > div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}
	img {
		margin: 0 0 0 8px;
	}
	input {
		flex-grow: 1;
		padding: 8px;

		margin-left: 4px;
	}

	button.fancy {
		padding: 2px 8px;
		margin: 0 16px;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	html[data-theme='dark'] button.fancy {
		border-bottom: 1px solid hsla(352, 100%, 26.7%, 1);
	}
</style>
