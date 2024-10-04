<script>
	import { player } from '$/stores';
	import Forward5 from '$lib/icons/Forward5.svelte';
	export let size = 30;
	export let color;
</script>

<button
	on:click={() => $player.currentTime(Math.min($player.currentTime() + 5, $player.duration()))}
	aria-label="Fast Forward"
>
	<Forward5 {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
