<script>
	import initializeEpisode from '$lib/Editor/_functions/initializeEpisode';
	import {
		rightPane,
		showLiveEpisodes,
		rssData,
		episodesList,
		editingEpisode,
		podcastList,
		editorDB,
		selectorList,
		showSaved
	} from '$/editor';
	import initTinyMCE from '$lib/Editor/Tags/ShowNotes/initTinyMCE';

	$rightPane = 'episodeMetadata';
</script>

<div />

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-left: 8px;
	}
	ul {
		padding: 0;
		margin: 0;
		background-color: white;
		width: 100%;
		height: calc(100% - 40px);
		grid-area: selector;
	}

	li {
		padding: 8px;
		border-bottom: 1px solid #eee;
		cursor: pointer;
		list-style: none;
		font-size: 1em;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 4px;
		border-radius: 4px;
		user-select: none;
	}

	.create {
		color: rgb(128, 0, 179);
		font-size: 1.1em;
		font-weight: bold;
		border: 1px solid rgb(128, 0, 179);
	}

	.active {
		color: rgb(27, 111, 246);
		font-weight: bold;
		border: 1px solid rgb(27, 111, 246);
	}

	button.save-state {
		width: calc(100% - 8px);
	}
</style>
