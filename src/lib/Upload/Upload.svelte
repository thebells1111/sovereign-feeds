<script>
	import { io } from 'socket.io-client';
	import { onDestroy } from 'svelte';
	import { remoteServerUrl, socketUrl } from '$/editor';

	console.log('socket');
	const socket = io(socketUrl);
	socket.on('connect', (data) => {
		console.log('Connected to Socket');
		socket.emit('cool', 'beans');
	});

	socket.on('id', (socket_id) => {
		id = socket_id;
		console.log(id);
		fetch(`api/sendjwt?id=${id}`, { credentials: 'include' });
	});

	onDestroy(() => {
		socket.disconnect();
	});
	export let fileName = '';
	export let path;
	export let showUpload = false;
	import { editingEpisode, selectedPodcast } from '$/editor';
	let files;
	let size;
	let image;
	let isUploading = false;
	let fileUrl;
	let id;
	import LoadingAnimation from './LoadingAnimation.svelte';
	import FileChoice from './FileChoice.svelte';

	function handleDrop(e) {
		let data = e.dataTransfer;
		console.log(data);
		files = data.files;

		var reader = new FileReader();
		reader.onload = function (e) {
			image.src = e.target.result;
		};
		reader.readAsDataURL(files[0]);
	}

	function humanFileSize(size) {
		var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
		return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	}

	function handleInputChange(e) {
		image.src = URL.createObjectURL(files[0]);
	}

	function upload() {
		const formData = new FormData();
		isUploading = true;
		formData.append('file', files[0]);
		let fullPath = `${$selectedPodcast.title}/` + path;
		console.log(fullPath);
		const upload = fetch(
			`${remoteServerUrl}/api/sf/upload?folder=${encodeURIComponent(fullPath)}&&podcast=${
				$selectedPodcast.title
			}&&id=${id}`,
			{
				method: 'POST',
				body: formData
			}
		)
			.then((response) => response.text())
			.then((result) => {
				console.log('Success:', result);
				fileUrl = JSON.parse(result);
				isUploading = false;
				files = undefined;
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
	on:drop|preventDefault={handleDrop}
	on:dragover|preventDefault={(e) => (e.dataTransfer.dropEffect = 'copy')}
>
	<div class="container">
		{#if isUploading}
			<LoadingAnimation />
		{:else if fileUrl}
			<FileChoice bind:fileName bind:showUpload bind:fileUrl />
		{:else}
			<label>
				Click Here or Drag Your File to Upload
				<input id="fileUpload" type="file" bind:files hidden on:change={handleInputChange} />
			</label>
			{#if files?.[0]}
				<img
					src={image?.src}
					bind:this={image}
					class:show={image?.src}
					on:error={() => {
						image.src = '';
					}}
				/>

				<p class="file-name">
					{files[0].name}
				</p>
				<p>
					{humanFileSize(files[0].size)}
				</p>
				<button on:click={upload} class="primary">Upload</button>
			{/if}
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
