<script>
	import Header from './Header/Header.svelte';
	import LiveItem from './LiveItem/LiveItem.svelte';
	import EpisodeMetadata from './EpisodeMetadata/EpisodeMetadata.svelte';
	import Person from './Person/Person.svelte';
	import Chapters from './Chapters/Chapters.svelte';
	import Transcript from './Transcript/Transcript.svelte';
	import Value from './Value/Value.svelte';
	import Funding from './Funding/Funding.svelte';
	import EditShowNotes from './ShowNotes/EditShowNotes.svelte';
	import Social from './Social/Social.svelte';
	import Images from './Images/Images.svelte';
	import ValueSplits from './ValueSplits/ValueSplits.svelte';
	import AlternateEnclosure from './AlternateEnclosure/AlternateEnclosure.svelte';
	import Location from '$lib/Tags/Location/Location.svelte';
	import initTinyMCE from '$lib/Tags/ShowNotes/initTinyMCE';

	import { rightPane, showNotesPane, editingEpisode } from '$/editor';
</script>

<svelte:head>
	<script src="/tinymce/tinymce.min.js" on:load={initTinyMCE}></script>
</svelte:head>

<Header />

<div bind:this={$showNotesPane} class="notes">
	<div class:hide={$rightPane != 'liveItem'}>
		<LiveItem />
	</div>
	<div class:hide={$rightPane != 'episodeMetadata'}>
		<EpisodeMetadata />
	</div>
	<div class="show-notes" class:hide={$rightPane != 'showNotes'}>
		<EditShowNotes />
	</div>
	<div class:hide={$rightPane != 'person'}>
		<Person type="episode" />
	</div>
	<div class:hide={$rightPane != 'social'}>
		<Social />
	</div>
	<div class:hide={$rightPane != 'chapters'}>
		<Chapters />
	</div>
	<div class:hide={$rightPane != 'transcript'}>
		<Transcript />
	</div>
	<div class:hide={$rightPane != 'value'}>
		<Value />
	</div>
	<div class:hide={$rightPane != 'funding'}>
		<Funding bind:data={$editingEpisode} />
	</div>
	<!-- <div class:hide={$rightPane != 'images'}>
		<Images type={'episode'} />
	</div> -->
	<div class:hide={$rightPane != 'valueSplits'}>
		<ValueSplits />
	</div>
	<div class:hide={$rightPane != 'altEnclosures'}>
		<AlternateEnclosure />
	</div>
	{#if $editingEpisode?.['podcast:location']}
		<div class:hide={$rightPane != 'location'}>
			<Location bind:data={$editingEpisode['podcast:location']} />
		</div>
	{/if}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
	.notes {
		width: 100%;
		height: calc(100% - 110px);

		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		grid-area: workspace;
	}

	.show-notes {
		height: 100%;
	}
	.hide {
		display: none;
	}
</style>
