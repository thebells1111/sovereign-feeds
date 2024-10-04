<script>
	import PreviousChapter from '$lib/Shared/Player/PreviousChapter.svelte';
	import RewindButton from '$lib/Shared/Player/RewindButton.svelte';
	import PlayPauseButton from '$lib/Shared/Player/PlayPauseButton.svelte';
	import FastFowardButton from '$lib/Shared/Player/FastFowardButton.svelte';
	import NextChapter from '$lib/Shared/Player/NextChapter.svelte';
	import AudioProgressBar from '$lib/Shared/Player/AudioProgressBar.svelte';
	import PlayerDuration from '$lib/Shared/Player/PlayerDuration.svelte';
	import PlayerTime from '$lib/Shared/Player/PlayerTime.svelte';

	export let chapters;

	import { player, playingEpisodeChapters, chapterIndex } from '$/stores';

	const buttonColor = 'white';
</script>

<!-- svelte-ignore a11y-media-has-caption-->
<div class="container">
	<div class="progress-bar">
		<AudioProgressBar />
		<div class="time">
			<PlayerTime />
		</div>
		<div class="duration">
			<PlayerDuration />
		</div>
	</div>

	<div class="bottom-bar">
		<div class="control-buttons">
			{#if $playingEpisodeChapters?.length > 0}
				<PreviousChapter size="36" color={buttonColor} />
			{/if}
			<RewindButton color={buttonColor} />
			<PlayPauseButton color={buttonColor} />
			<FastFowardButton color={buttonColor} />
			{#if $playingEpisodeChapters?.length > 0}
				<NextChapter size="36" color={buttonColor} />
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		user-select: none;
		position: absolute;
		background-color: hsl(226, 82%, 20%);
		bottom: 0;
		left: 0;
		color: white;
	}

	.progress-bar {
		padding: 0 8px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time {
		position: absolute;
		left: 8px;
		bottom: 0;
	}

	.duration {
		position: absolute;
		right: 8px;
		bottom: 0;
	}

	.bottom-bar {
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: center;
	}

	.control-buttons {
		margin: 0;
		display: inline-flex;
		align-items: center;
	}
</style>
