<script>
	import { player } from '$/stores';
	import Forward30 from '$lib/icons/Forward30.svelte';
	export let size = 30;
	export let color;
</script>

<button
	on:click={() => {
		$player.currentTime(Math.min($player.currentTime() + 30, $player.duration()));
	}}
	aria-label="Fast Forward"
>
	<Forward30 {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
