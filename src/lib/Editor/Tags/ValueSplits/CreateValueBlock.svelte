<script>
	import AlbumValueBlock from './CreateValueBlock/AlbumValueBlock.svelte';
	import CustomValueBlock from './CreateValueBlock/CustomValueBlock.svelte';
	export let basePercent = 95;
	let activeView = 'albums';

	import { editingAudioItem } from '$/editor';

	$: if ($editingAudioItem) {
		activeView = 'custom';
	}
</script>

<screen-select>
	<button class="primary album" on:click={() => (activeView = 'albums')}>Albums</button>
	<button class="primary custom" on:click={() => (activeView = 'custom')}>Custom</button>
</screen-select>

<div class:hidden={activeView !== 'albums'}>
	<AlbumValueBlock {basePercent} />
</div>

<div class:hidden={activeView !== 'custom'}>
	<CustomValueBlock {basePercent} />
</div>

<style>
	screen-select {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 8px 8px 0;
		padding-top: 8px;
		border-top: 1px solid var(--border-color);
	}

	div {
		overflow: auto;
	}

	.hidden {
		display: none;
	}

	button.primary {
		margin: 0 8px;
	}
	.album {
		background-image: linear-gradient(to bottom, hsl(337, 100%, 44%), hsla(337, 100%, 26.7%, 1));
	}

	.custom {
		background-image: linear-gradient(to bottom, hsl(104, 100%, 44%), hsla(104, 100%, 26.7%, 1));
	}
</style>
