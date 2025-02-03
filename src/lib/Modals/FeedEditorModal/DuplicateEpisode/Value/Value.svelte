<script>
	import SharedValueComponent from '$lib/Tags/Value/SharedValueComponent.svelte';
	import { rssData, editingEpisode, duplicateEditorScreen, newEpisodeHeaders } from '$/editor';
	import blankValue from '$lib/Tags/Value/cleanValue';
	import clone from 'just-clone';

	let episodeValueBlock1 = $editingEpisode?.['podcast:value']?.['podcast:valueRecipient']?.[0];

	let podcastValueBlock = $rssData?.['podcast:value']?.['podcast:valueRecipient'];

	function addRecipient() {
		let block = $editingEpisode?.['podcast:value'] || clone(blankValue);
		if (!block['podcast:valueRecipient'][0]) {
			block['podcast:valueRecipient'][0] = {
				'@_name': '',
				'@_type': 'node',
				'@_address': '',
				'@_customKey': '',
				'@_customValue': '',
				'@_split': '',
				'@_fee': ''
			};
		}
		block['podcast:valueRecipient'][0]['@_name'] = 'Person 1';
		$editingEpisode['podcast:value'] = block;
		episodeValueBlock1 = $editingEpisode?.['podcast:value']?.['podcast:valueRecipient']?.[0];
	}
</script>

<div class="overflow-container">
	<div class="card">
		<h3>Value</h3>
		{#if !episodeValueBlock1?.['@_name'] && !episodeValueBlock1?.['@_address']}
			<div class="value-block-add">
				{#if podcastValueBlock?.length > 1 || podcastValueBlock?.['podcast:valueRecipient']?.[0]['@_name'] || podcastValueBlock?.['podcast:valueRecipient']?.[0]['@_address']}
					<h2>You already have a value block associated with your show, but not this episode.</h2>
				{:else}
					<h2>You don't have a value block associated with your show, nor this episode.</h2>
				{/if}
				<h2>Click below if you'd like to add one to this episode.</h2>
				<button class="primary" on:click={addRecipient}>Add Value Block to Episode</button>
			</div>
		{:else}
			<div class="indent">
				<SharedValueComponent bind:data={$editingEpisode['podcast:value']} standAlone={true} />
			</div>
		{/if}
	</div>
</div>
<div class="footer">
	<button class="primary" on:click={() => ($duplicateEditorScreen = 'chaptersTranscriptsSocial')}>
		{$newEpisodeHeaders.chaptersBack}
	</button>
	<button class="primary" on:click={() => ($duplicateEditorScreen = 'cast')}>
		{$newEpisodeHeaders.cast}
	</button>
</div>

<style>
	.card {
		padding: 8px;
		border-radius: 8px;
		background-color: hsl(0, 0%, 100%);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		height: calc(100%);
		overflow: auto;
	}

	h3 {
		margin: 0 0 4px 0;
		font-weight: 800;
		color: hsl(226, 82%, 30%);
	}

	.indent {
		padding: 0 8px 0 16px;
		height: calc(100% - 30px);
	}

	.overflow-container {
		height: calc(100% - 64px);
		overflow: auto;
		padding: 8px;
	}

	.footer {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	button.primary {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
	}

	.value-block-add {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-top: 120px;
	}

	h2 {
		margin-top: 0;
	}
</style>
