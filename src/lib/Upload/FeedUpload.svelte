<script>
	import FileChoice from './FileChoice.svelte';
	import { onMount } from 'svelte';
	import { remoteServerUrl, socketUrl } from '$/editor';
	import buildRSS from '$lib/Editor/Publish/buildrss';

	onMount(() => {
		handleUpload();
	});

	import { selectedPodcast } from '$/editor';

	export let showUpload = false;
	export let fileName = '';
	let isUploading = true;
	let fileUrl;
	let id;
	import LoadingAnimation from './LoadingAnimation.svelte';

	async function handleUpload() {
		isUploading = true;
		console.log(id);
		let { title, xmlFile } = await buildRSS();
		if (!xmlFile) {
			return;
		}
		console.log(title);
		// console.log(xmlFile);

		const file = new Blob([xmlFile], {
			type: 'application/xml'
		});
		const formData = new FormData();
		formData.append('file', file, 'feed.xml');
		let fullPath = `${$selectedPodcast.title}`;
		const upload = fetch(
			`${remoteServerUrl}/api/sf/upload?folder=${encodeURIComponent(fullPath)}&&podcast=${
				$selectedPodcast.title
			}`,
			{
				method: 'POST',
				body: formData,
				credentials: 'include'
			}
		)
			.then((response) => response.text())
			.then((result) => {
				console.log('Success:', result);
				fileUrl = JSON.parse(result);
				isUploading = false;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

<div
	class="modal"
	on:mousedown|self={() => {
		showUpload = false;
	}}
>
	<div class="container">
		{#if isUploading}
			<LoadingAnimation />
		{:else if fileUrl}
			<FileChoice bind:fileName bind:showUpload bind:fileUrl />
		{/if}
	</div>
</div>

<style>
	.modal {
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.upload-container {
		display: grid;
		place-items: center;
		flex-grow: 1;
	}

	.container {
		width: 50%;
		min-height: 60%;
		background-color: white;
		border-radius: 8px;
		padding: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	img {
		margin-top: 8px;
		display: none;
		width: 120px;
	}
	.show {
		display: initial;
	}

	label {
		width: 100%;
		border: 1px dotted black;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25em;
		flex-grow: 1;
		cursor: pointer;
	}

	.file-name {
		font-weight: 600;
	}
	p {
		margin: 0;
		padding: 0;
	}

	button {
		margin: 8px;
	}
</style>
