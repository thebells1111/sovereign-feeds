<script>
	import { afterUpdate } from 'svelte';
	import { valueAudioItem, editingEpisode, showLiveEpisodes } from '$/editor';
	import PreProduction from './PreProduction.svelte';
	import PostProdcution from './PostProdcution.svelte';
	import LiveProduction from './LiveProduction.svelte';

	import TimerButton from './TimerButton.svelte';
	let viewer = 'pre';

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

	let formattedTime = '00:00:00:00';
	let syncedTime = 0;

	function handleTimeUpdate(value) {
		syncedTime = value;
		let hours = Math.floor(value / 3600);
		let minutes = Math.floor((value % 3600) / 60);
		let seconds = Math.floor(value % 60);
		let ms = Math.floor((value % 1) * 100);
		formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
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
			if ($showLiveEpisodes) {
				viewer = 'live';
			} else {
				viewer = 'post';
			}
		}}>{$showLiveEpisodes ? 'Live' : 'Post'} Production</button
	>
</button-container>
<div>
	{#if viewer === 'pre'}
		<PreProduction bind:syncedTime />
	{:else if viewer === 'post'}
		<PostProdcution />
	{:else if viewer === 'live'}
		<LiveProduction bind:syncedTime />
	{/if}

	<sync class:hidden={viewer === 'post'}>
		<TimerButton onTimeUpdate={handleTimeUpdate} />
		<p>Elapsed time: {formattedTime}</p>
	</sync>
</div>

<style>
	div {
		height: calc(100% - 45px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
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

	.hidden {
		display: none;
	}
</style>
