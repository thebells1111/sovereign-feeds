<script>
	import Value from '$lib/Tags/Value/Value.svelte';

	import {
		newEditorScreen,
		editingEpisode,
		currentPage,
		editorDB,
		podcastList,
		showNewEditor,
		showSaved,
		selectedPodcast,
		rightPane,
		xmlJson,
		rssData
	} from '$/editor';

	async function getPodcast() {
		$rightPane = 'publisherMetadata';

		$xmlJson = $selectedPodcast.xml;
		$selectedPodcast.rss = $rssData;

		$editingEpisode = null;
		$currentPage = 'podcastMetadata';
		$newEditorScreen = 'publisher';
		editorDB.setItem('favorites', $podcastList);
		$showNewEditor = false;
		$showSaved = true;
	}
</script>

<div class="overflow-container">
	<Value type="podcast" />
</div>

<div class="footer">
	<button class="primary" on:click={() => ($newEditorScreen = 'publisherImages')}> Images </button>
	<button class="primary" on:click={getPodcast}> Finish Feed </button>
</div>

<style>
	.overflow-container {
		height: calc(100% - 64px);
		overflow: auto;
		padding: 8px;
	}

	.footer {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		align-items: center;
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	button.primary {
		align-self: flex-end;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
		margin-bottom: 8px;
	}
</style>
