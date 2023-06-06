<script>
	import AlbumValueBlock from './CreateValueBlock/AlbumValueBlock.svelte';
	import CustomValueBlock from './CreateValueBlock/CustomValueBlock.svelte';
	export let basePercent = 95;
	let activeView = 'albums';
</script>

<screen-select>
	<button class="primary album" on:click={() => (activeView = 'albums')}>Albums</button>
	<button class="primary value" on:click={() => (activeView = 'custom')}>Custom</button>
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
		margin-bottom: 8px;
	}

	.hidden {
		display: none;
	}
</style>
