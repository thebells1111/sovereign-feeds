<script>
	import EpisodeMeta from './EpisodeMeta.svelte';
	import ShowNotes from './ShowNotes/ShowNotes.svelte';
	import ChaptersTranscriptsSocial from './ChaptersTranscriptsSocial/ChaptersTranscriptsSocial.svelte';
	import Value from './Value/Value.svelte';
	import Cast from './Cast/Cast.svelte';
	import { duplicateEditorScreen } from '$/editor';
</script>

<div class:hide={$duplicateEditorScreen !== 'episodeMeta'}>
	<EpisodeMeta />
</div>
<div class:hide={$duplicateEditorScreen !== 'showNotes'}>
	<ShowNotes />
</div>
<div class:hide={$duplicateEditorScreen !== 'chaptersTranscriptsSocial'}>
	<ChaptersTranscriptsSocial />
</div>
<div class:hide={$duplicateEditorScreen !== 'value'}>
	<Value />
</div>
<div class:hide={$duplicateEditorScreen !== 'cast'}>
	<Cast />
</div>

<style>
	div {
		height: 100%;
	}
	.hide {
		display: none;
	}
</style>
