<script>
	import initTinyMCE from './initTinyMCE';
	import { onMount, onDestroy } from 'svelte';
	import { rssData, duplicateEditorScreen, editingEpisode, newEpisodeHeaders } from '$/editor';

	async function setupMCE() {
		await initTinyMCE();
		tinymce.get('duplicate-editor-description').setContent($editingEpisode.description);
	}

	async function destroyMCE() {
		console.log('destroyed');
		tinymce.get('duplicate-editor-description').destroy();
	}

	onMount(setupMCE);
	onDestroy(destroyMCE);
</script>

{#if $rssData}
	<div class="overflow-container">
		<section>
			<div class="show-notes">
				<textarea id="duplicate-editor-description" />
			</div>
		</section>
	</div>
	<div class="footer">
		<button class="primary" on:click={() => ($duplicateEditorScreen = 'episodeMeta')}>
			{$newEpisodeHeaders.metaBack}
		</button>
		<button
			class="primary"
			on:click={() => {
				console.log('s:', $editingEpisode.description);
				$duplicateEditorScreen = 'chaptersTranscriptsSocial';
			}}
		>
			{$newEpisodeHeaders.chapters}
		</button>
	</div>
{/if}

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
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	section {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.show-notes {
		overflow: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	textarea {
		height: 100%;
		width: 100%;
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
</style>
