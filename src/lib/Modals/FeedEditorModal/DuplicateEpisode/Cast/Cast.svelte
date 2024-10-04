<script>
	import Podcast from '$lib/Tags/Person/PersonEditor.svelte';
	import {
		rssData,
		editingEpisode,
		duplicateEditorScreen,
		showNewEditor,
		newEpisodeHeaders,
		episodesList,
		editorDB,
		podcastList,
		showSaved
	} from '$/editor';
</script>

<div class="overflow-container">
	<div class="card">
		<h3>{$newEpisodeHeaders.castTitle}</h3>
		<div class="indent">
			<Podcast bind:data={$editingEpisode['podcast:person']} type={'episode'} standAlone={true} />
		</div>
	</div>
</div>
<div class="footer">
	<button class="primary" on:click={() => ($duplicateEditorScreen = 'value')}>
		{$newEpisodeHeaders.valueBack}
	</button>
	<button
		class="primary wrap"
		on:click={() => {
			$showNewEditor = false;
			$duplicateEditorScreen = 'episodeMeta';
			let descendingTypes = ['audiobook', 'music'];

			if (descendingTypes.includes($rssData?.['podcast:medium'])) {
				$episodesList[$episodesList.length - 1] = $editingEpisode;
			} else {
				$episodesList[0] = $editingEpisode;
			}

			window.tinymce.get('tiny-editor-description').setContent($editingEpisode.description);
			editorDB.setItem('favorites', $podcastList);
			$showSaved = true;
		}}
	>
		{$newEpisodeHeaders.wrap}
	</button>
</div>

<style>
	.card {
		padding: 8px;
		margin-bottom: 16px;
		border-radius: 8px;
		background-color: hsl(0, 0%, 100%);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	h3 {
		margin: 0 0 4px 0;
		font-weight: 800;
		color: hsl(226, 82%, 30%);
	}

	.indent {
		padding: 0 8px 0 16px;
	}

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
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	button.primary {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
	}

	button.wrap {
		background-image: linear-gradient(to bottom, hsla(140, 100%, 33%, 1), hsla(140, 100%, 16%, 1));
		width: 235px;
		height: 50px;
	}
</style>
