<script>
	import { player, playerSaveTime } from '$/stores';
	import Replay10 from '$lib/icons/Replay10.svelte';
	export let size = 30;
	export let color;
</script>

<button
	on:click={() => {
		$player.currentTime(Math.max($player.currentTime() - 10, 0));
		$playerSaveTime = 0;
	}}
	aria-label="Rewind"
>
	<Replay10 {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
