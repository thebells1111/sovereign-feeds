<script>
	import { player, chapterIndex, playingEpisodeChapters } from '$/stores';
	import NextChapter from '$lib/icons/NextChapter.svelte';
	export let size = 30;
	export let color;

	function gotoNextChapter() {
		if ($chapterIndex < 0) {
			$chapterIndex = 0;
		}

		if ($chapterIndex > -1 && $chapterIndex < $playingEpisodeChapters.length - 1) {
			$chapterIndex = $chapterIndex + 1;
			$player.currentTime = $playingEpisodeChapters[$chapterIndex].startTime;
		}
	}
</script>

<button on:click={gotoNextChapter} aria-label="Next Chapter">
	<NextChapter {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
