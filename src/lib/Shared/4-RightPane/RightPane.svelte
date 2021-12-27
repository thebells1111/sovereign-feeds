<script>
	import ShowNotes from './ShowNotes/ShowNotes.svelte';
	import Chapters from './Chapters/Chapters.svelte';
	import PlayList from '$lib/Shared/3-MiddlePane/PlayList/PlayList.svelte';
	import Transcripts from './Transcripts/Transcripts.svelte';

	import { rightPane, showNotesPane, selectedEpisode, selectedEpisodeTranscript } from '$/stores';

	$: console.log($selectedEpisodeTranscript);
</script>

<div class="right-pane">
	<section class="tab-zone">
		<button
			class="left-button"
			class:active={$rightPane === 'showNotes'}
			on:click={() => ($rightPane = 'showNotes')}>ShowNotes</button
		>
		{#if $selectedEpisode && $selectedEpisode.chaptersUrl}
			<button
				class:active={$rightPane === 'chapters'}
				on:click={() => {
					$rightPane = 'chapters';
				}}>Chapters</button
			>
		{/if}

		{#if $selectedEpisode && $selectedEpisodeTranscript && $selectedEpisode.transcripts?.find(({ type }) => type === 'application/srt')}
			<button
				class:active={$rightPane === 'transcripts'}
				on:click={() => {
					$rightPane = 'transcripts';
				}}>Transcripts</button
			>
		{/if}
	</section>

	<div bind:this={$showNotesPane} class="notes">
		{$selectedEpisode &&
			$selectedEpisodeTranscript &&
			$selectedEpisode.transcripts?.find(({ type }) => type === 'application/srt')}
		<div class:hide={$rightPane != 'showNotes'}>
			<ShowNotes />
		</div>
		<div class:hide={$rightPane != 'chapters'}>
			<Chapters />
		</div>
		<div class:hide={$rightPane != 'playlist'}>
			<PlayList />
		</div>
		<div class:hide={$rightPane != 'transcripts'}>
			<Transcripts />
		</div>
	</div>
</div>

<style>
	.right-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.notes {
		height: 100%;
		overflow: auto;
	}
	.notes > div {
		height: 100%;
		overflow-x: hidden;
	}
	.hide {
		display: none;
	}

	.tab-zone {
		display: flex;
	}

	.tab-zone button {
		width: 100%;
		height: 50px;
		background-color: transparent;
		border: 1px solid #eee;
	}

	button.active {
		font-weight: 600;
		border-bottom-color: transparent;
	}

	button.left-button {
		border-left-color: transparent;
	}
</style>
