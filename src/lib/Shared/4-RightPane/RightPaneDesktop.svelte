<script>
	import Header from './Header.svelte';
	import ShowNotes from './ShowNotes/ShowNotes.svelte';
	import Chapters from './Chapters/Chapters.svelte';
	import PlayList from '$lib/Shared/3-MiddlePane/PlayList/PlayList.svelte';
	import Transcripts from './Transcripts/Transcripts.svelte';

	import { rightPane, showNotesPane, selectedEpisode, selectedPodcast } from '$/stores';

	let tabNumber;
	let activeTab = 0;
	let showChapters = false;
	let showTranscripts = false;

	$: if ($selectedPodcast) {
		activeTab = 0;
	}

	$: if ($selectedEpisode) {
		tabNumber = 0;
		showChapters = false;
		showTranscripts = false;
		if ($selectedEpisode.chaptersUrl) {
			showChapters = true;
			tabNumber++;
		}
		if (
			$selectedEpisode?.transcripts &&
			$selectedEpisode?.transcripts?.find(({ type }) => type === 'application/srt')
		) {
			showTranscripts = true;
			tabNumber++;
		}
	}

	let paneWidth;
	$: buttonOffset = (paneWidth / (tabNumber + 1) - 100) / 2;
	$: activeOffset = (paneWidth / (tabNumber + 1)) * activeTab + buttonOffset;

	function selectTab(tab) {
		$rightPane = tab;
		if (tabNumber === 1) {
			if (tab !== 'showNotes') {
				activeTab = 1;
			} else {
				activeTab = 0;
			}
		} else if (tabNumber === 2) {
			if (tab === 'showNotes') {
				activeTab = 0;
			} else if (tab === 'chapters') {
				activeTab = 1;
			} else if (tab === 'transcripts') {
				activeTab = 2;
			}
		}
	}
</script>

<div class="right-pane" bind:clientWidth={paneWidth}>
	<Header />
	<section class="tab-zone">
		<button class:active={$rightPane === 'showNotes'} on:click={selectTab.bind(this, 'showNotes')}>
			<p>ShowNotes</p>
		</button>
		{#if showChapters}
			<button class:active={$rightPane === 'chapters'} on:click={selectTab.bind(this, 'chapters')}
				><p>Chapters</p></button
			>
		{/if}
		{#if showTranscripts}
			<button
				class:active={$rightPane === 'transcripts'}
				on:click={selectTab.bind(this, 'transcripts')}><p>Transcripts</p></button
			>
		{/if}
		<div class="active-tab" style={`margin-left:${activeOffset}px`} />
	</section>

	<div bind:this={$showNotesPane} class="notes">
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
	.tab-zone {
		display: flex;
		position: relative;
	}

	.active-tab {
		position: absolute;
		content: '';
		height: 2px;
		width: 100px;
		background-color: #333;
		bottom: 18px;
		left: 0;
		border-radius: 3px;
		transition: 0.3s ease-in-out;
	}

	.right-pane {
		display: flex;
		flex-direction: column;
		height: calc(100% - 12px);
		position: relative;
		top: 8px;
	}
	.notes {
		height: 100%;
		overflow: auto;
	}
	.notes > div {
		height: 100%;
		overflow: hidden;
	}
	.hide {
		display: none;
	}

	.tab-zone button {
		width: 100%;
		height: 50px;
		background-color: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.tab-zone button > p {
		margin: 0;
		padding: 0;
		width: 100px;
		text-align: center;
		position: relative;
	}

	button.active {
		font-weight: 600;
		font-size: 1.05em;
		border-bottom-color: transparent;
		color: #333;
		transition: 0.3s ease-in-out;
	}
</style>
