<script>
	import { player, chapterIndex, playingEpisodeChapters, playerSaveTime } from '$/stores';

	import PreviousChapter from '$lib/icons/PreviousChapter.svelte';
	export let size = 30;
	export let color;

	function gotoPreviousChapter() {
		if ($chapterIndex > $playingEpisodeChapters.length - 1) {
			$chapterIndex = $playingEpisodeChapters.length - 1;
		}

		if ($chapterIndex < $playingEpisodeChapters.length - 1 && $chapterIndex > 0) {
			$chapterIndex = $chapterIndex - 1;
			$player.currentTime = $playingEpisodeChapters[$chapterIndex].startTime;
			$playerSaveTime = 0;
		}
	}
</script>

<button on:click={gotoPreviousChapter} aria-label="Previous Chapter">
	<PreviousChapter {size} {color} />
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
