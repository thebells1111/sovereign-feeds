<script>
	import { editingEpisode, episodesList, editingIndex } from '$/editor';
	import blankTranscript from '$lib/Editor/_functions/blanks/transcript';
	import TextBlock from '$lib/Editor/Tags/Shared/TextBlock.svelte';
	import Select from 'svelte-select';
	import Upload from '$lib/Upload/Upload.svelte';
	export let data;
	let showUpload = false;
	let fileName;
	let types = ['application/srt', 'text/vtt', 'application/json', 'text/html', 'text/plain'];

	export let index = 0;

	$: if (fileName) {
		handleFileNameChange();
	}

	function handleFileNameChange() {
		data[index]['@_url'] = fileName;
	}

	function changeCaption(e) {
		if (e.target.checked) {
			data[index]['@_rel'] = 'captions';
		} else {
			data[index]['@_rel'] = '';
		}
	}

	function changeMimeType(e) {
		console.log(e);
		data[index]['@_type'] = e.detail.value;
	}
</script>

<div class="container">
	<div class="blocks-container">
		{#if data}
			<TextBlock
				title="URL"
				{index}
				bind:data={data[index]['@_url']}
				noStyle={true}
				bind:showUpload
				showUploadButton={true}
			/>

			<div class="themed">
				<h4>File Mime Type</h4>

				<Select
					items={types}
					value={data[index]['@_type']}
					isCreatable={true}
					on:select={changeMimeType}
				/>
			</div>

			<TextBlock
				title="Language (optional)"
				{index}
				bind:data={data[index]['@_language']}
				noStyle={true}
			/>

			<label>
				<input type="checkbox" on:change={changeCaption} />
				<h4>
					Check this box if the transcript file contains time stamps and is suitable for Closed
					Captions
				</h4>
			</label>
		{/if}
	</div>
</div>

{#if showUpload}
	<Upload path={`${$editingEpisode.title}/transcripts`} bind:fileName bind:showUpload />
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 8px;
		width: 100%;
	}

	.blocks-container {
		overflow: auto;
	}

	label {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.themed {
		margin: 0 4px 8px 4px;
	}

	h4 {
		margin: 0 48px 0 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	input[type='checkbox'] {
		margin: 0 16px;
		transform: scale(1.5);
	}
</style>
