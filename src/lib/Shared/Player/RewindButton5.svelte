<script>
	import { player, playerSaveTime } from '$/stores';
	import Replay5 from '$lib/icons/Replay5.svelte';
	export let size = 30;
	export let color;
</script>

<button
	on:click={() => {
		$player.currentTime(Math.max($player.currentTime() - 5, 0));
		$playerSaveTime = 0;
	}}
	aria-label="Rewind"
>
	<Replay5 {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
