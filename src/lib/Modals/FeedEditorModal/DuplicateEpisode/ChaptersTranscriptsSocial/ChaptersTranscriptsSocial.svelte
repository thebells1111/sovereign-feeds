<script>
	import Chapters from './Chapters.svelte';
	import Transcript from './Transcript.svelte';
	import SocialInteract from './SocialInteract.svelte';

	import { rssData, editingEpisode, duplicateEditorScreen, newEpisodeHeaders } from '$/editor';
</script>

<div class="overflow-container">
	<div class="card">
		<h3>
			{$newEpisodeHeaders.chaptersTitle}
		</h3>
		<div class="indent">
			<Chapters />
		</div>
	</div>
	<div class="card">
		<h3>{$newEpisodeHeaders.transcriptsTitle}</h3>
		<div class="indent">
			<Transcript data={$editingEpisode['podcast:transcript']} />
		</div>
	</div>
	<div class="card">
		<h3>{$newEpisodeHeaders.commentsTitle}</h3>
		<div class="indent">
			<SocialInteract data={$editingEpisode['podcast:socialInteract']} />
		</div>
	</div>
</div>
<div class="footer">
	<button class="primary" on:click={() => ($duplicateEditorScreen = 'showNotes')}>
		{$newEpisodeHeaders.notesBack}
	</button>
	<button class="primary" on:click={() => ($duplicateEditorScreen = 'value')}>
		{$newEpisodeHeaders.value}
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
</style>
