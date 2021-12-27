<script>
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import ShowNotes from './ShowNotes/ShowNotes.svelte';
	import Chapters from './Chapters/Chapters.svelte';
	import PlayList from '$lib/Shared/3-MiddlePane/PlayList/PlayList.svelte';
	import Transcripts from './Transcripts/Transcripts.svelte';

	import {
		rightPane,
		showNotesPane,
		selectedEpisode,
		showNotesModalSwiper,
		swiper,
		showNotesVerticalSwiper
	} from '$/stores';

	let tabNumber;
	let activeTab = 0;
	let showChapters = false;
	let showTranscripts = false;

	onMount(() => {
		$showNotesModalSwiper = new Swiper('.shownotes-modal-swiper', {});

		$showNotesModalSwiper.on('slideChange', function () {
			let s = $showNotesModalSwiper;
			let i = s.activeIndex;
			selectTab(i);
		});
	});

	$: if ($selectedEpisode && $showNotesModalSwiper) {
		selectTab(0, null, 0);
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
		$showNotesModalSwiper?.update();
	}

	let paneWidth;
	$: buttonOffset = (paneWidth / (tabNumber + 1) - 100) / 2;
	$: activeOffset = (paneWidth / (tabNumber + 1)) * activeTab + buttonOffset;

	function selectTab(index, tab, speed) {
		activeTab = index;
		$showNotesModalSwiper.slideTo(index, speed ?? 300);

		if (tab) {
			$rightPane = tab;
		} else if (index === 0) {
			$rightPane = 'showNotes';
		} else if (index === 2) {
			$rightPane = 'transcripts';
		} else if (showChapters) {
			$rightPane = 'chapters';
		} else {
			$rightPane = 'transcripts';
		}
	}

	let transcriptOffset;
</script>

<div class="right-pane" bind:clientWidth={paneWidth}>
	<button class="close" on:click={() => $showNotesVerticalSwiper.slideTo(0)} />
	<Header />
	<section class="tab-zone">
		<button
			class:active={$rightPane === 'showNotes'}
			on:click={selectTab.bind(this, 0, 'showNotes')}
		>
			<p>ShowNotes</p>
		</button>
		{#if showChapters}
			<button
				class:active={$rightPane === 'chapters'}
				on:click={selectTab.bind(this, 1, 'chapters')}><p>Chapters</p></button
			>
		{/if}
		{#if showTranscripts}
			<button
				class:active={$rightPane === 'transcripts'}
				on:click={selectTab.bind(this, showChapters ? 2 : 1, 'transcripts')}
				><p>Transcripts</p></button
			>
		{/if}
		<div class="active-tab" style={`margin-left:${activeOffset}px`} />
	</section>

	<div bind:this={$showNotesPane} class="notes">
		<div class="swiper shownotes-modal-swiper">
			<div class="swiper-wrapper">
				<div class="swiper-slide"><ShowNotes /></div>

				{#if showChapters}
					<div class="swiper-slide">
						<Chapters />
					</div>
				{/if}

				{#if showTranscripts}
					<div class="swiper-slide">
						<Transcripts bind:transcriptOffset />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.shownotes-modal-swiper {
		height: 100%;
	}
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
		height: calc(100% - 16px);
		background: #fff;
		position: relative;
		top: 16px;
		border-radius: 5px 5px 0 0;
		z-index: 33;
	}
	.notes {
		height: 100%;
		overflow: hidden;
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
		transition: 0.2s ease-in-out;
	}

	button.close {
		background: transparent;
		margin: 0;
		padding: 0;
		border: none;
		border-top: 1px solid #ddd;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		border-radius: 8px;
		box-shadow: 0px -8px 14px -8px rgb(0 0 0 / 75%);
		position: absolute;
	}
</style>
