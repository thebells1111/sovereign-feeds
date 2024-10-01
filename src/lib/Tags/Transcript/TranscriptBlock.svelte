<script>
	import { tagHeaders, editingEpisode } from '$/editor';
	import blankTranscript from '$lib/Editor/_functions/blanks/transcript';
	import TextBlock from '$lib/Tags/Shared/TextBlock.svelte';
	import Select from 'svelte-select';
	export let data;
	import IndexScroll from '../Shared/IndexScroll.svelte';
	let types = ['application/srt', 'text/vtt', 'application/json', 'text/html', 'text/plain'];
	import Upload from '$lib/Upload/Upload.svelte';
	let showUpload = false;
	let fileName;

	$: if (fileName) {
		handleFileNameChange();
	}

	function handleFileNameChange() {
		data[index]['@_url'] = fileName;
	}

	let index = 0;

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
	<IndexScroll bind:data bind:index blank={blankTranscript} title={'Transcripts'} />
	<div class="blocks-container">
		{#if data && data?.length > 0 && index < data?.length}
			<TextBlock
				title={$tagHeaders?.transcripts?.url}
				{index}
				bind:data={data[index]['@_url']}
				bind:showUpload
				showUploadButton={true}
			/>

			<div class="themed">
				<h4 style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>File Mime Type</h4>

				<Select
					items={types}
					value={data[index]['@_type']}
					isCreatable={true}
					on:select={changeMimeType}
				/>
			</div>

			<TextBlock title="Language (optional)" {index} bind:data={data[index]['@_language']} />

			<label>
				<input type="checkbox" on:change={changeCaption} />
				<h4 style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
					{$tagHeaders.transcripts.cc}
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
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
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
