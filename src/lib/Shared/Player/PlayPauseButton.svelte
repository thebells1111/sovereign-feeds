<script>
	import savePlayingPodcastState from '$functions/savePlayingPodcastState';

	import { player, playerIsPaused } from '$/stores';
	import Play from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	export let size = 30;
	export let style = '';

	function handlePlayButton() {
		if (!$playerIsPaused) {
			$playerIsPaused = true;
		}
		if ($player && $player.paused) {
			$player.play();
		} else if ($player) {
			$player.pause();
		}
	}
</script>

<button on:click={handlePlayButton} aria-label="Play Pause" {style}>
	{#if $playerIsPaused}
		<Play {size} />
	{:else}
		<Pause {size} />
	{/if}
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
		color: white;
	}
</style>
