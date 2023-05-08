<script>
	import { valueAudioItem, editingEpisode } from '$/editor';
	import PreProduction from './PreProduction.svelte';
	import PostProdcution from './PostProdcution.svelte';
	let viewer = 'pre';
	import { onMount, onDestroy, afterUpdate, setContext } from 'svelte';
	import { io } from 'socket.io-client';

	let socket;

	onMount(() => {
		socket = io('http://localhost:8000'); // Connect to the server with default options
		socket.on('disconnect', (reason) => {
			console.log('Disconnected, reason:', reason);
		});
	});

	onDestroy(() => {
		socket?.disconnect();
	});

	setContext('newValueBlock', {
		updateValue: (block) => {
			console.log(block);
			socket.emit('valueBlock', block);
		}
	});

	// async function sendData(block) {
	// 	socket.emit('valueBlock', JSON.stringify(block));
	// }

	afterUpdate(initializeAudioItem);

	function initializeAudioItem() {
		$valueAudioItem = $editingEpisode?.valueAudioItem || [];
	}

	$: updateEditingEpisode($valueAudioItem);

	function updateEditingEpisode() {
		if ($editingEpisode) {
			$editingEpisode.valueAudioItem = $valueAudioItem;
		}
	}
</script>

<button-container>
	<button
		class="primary pre"
		on:click={() => {
			viewer = 'pre';
		}}>Pre Production</button
	>
	<button
		class="primary"
		on:click={() => {
			viewer = 'post';
		}}>Post Production</button
	>
</button-container>
<div>
	{#if viewer === 'pre'}
		<PreProduction />
	{:else if viewer === 'post'}
		<PostProdcution />
	{/if}
</div>

<style>
	div {
		height: calc(100% - 45px);
		overflow: hidden;
	}

	button-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button-container > button {
		margin: 0 16px 8px 16px;
	}

	.pre {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}
</style>
