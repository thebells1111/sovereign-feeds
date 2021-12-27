<script>
	import Title from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Title.svelte';

	import Image from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Image.svelte';

	import Enclosure from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Enclosure.svelte';
	import GUID from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/GUID.svelte';
	import Link from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Link.svelte';
	import PubDate from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/PubDate.svelte';
	import Explicit from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Explicit.svelte';
	import Author from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Author.svelte';
	import Keywords from '$lib/Editor/4-RightPane/TagEditor/EpisodeMetadata/components/Keywords.svelte';

	import { rssData, showLiveEpisodes, duplicateEditorScreen, newEpisodeHeaders } from '$/editor';
</script>

{#if $rssData}
	<div class="overflow-container">
		<div class="card">
			<h3>{$newEpisodeHeaders.uniqueTitle}</h3>
			<div class="indent">
				<Title />
				<Enclosure />
				<GUID />
				<Link />
			</div>
		</div>

		<div class="card">
			<h3>{$newEpisodeHeaders.uniqueImageTitle}</h3>
			<div class="indent">
				<Image />
			</div>
		</div>

		<div class="card">
			<h3>You can change your Publication Date here.</h3>
			<div class="indent">
				{#if !$showLiveEpisodes}
					<PubDate />
				{/if}
			</div>
		</div>

		<div class="card">
			<h3>These typically don't need to be changed, but you can if you want.</h3>
			<div class="indent">
				<Explicit />
				<Author />
				<Keywords />
			</div>
		</div>
	</div>
	<div class="footer">
		<button class="primary" on:click={() => ($duplicateEditorScreen = 'showNotes')}>
			{$newEpisodeHeaders.notes}
		</button>
	</div>
{/if}

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
		justify-content: flex-end;
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
