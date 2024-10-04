<script>
	import {
		showNewEditor,
		newEditorScreen,
		editingEpisode,
		selectedPodcast,
		podcastList,
		editorDB,
		showSaved,
		rssData
	} from '$/editor';
	import NewPodcast from './NewPodcast/NewPodcast.svelte';
	import NewPodcastTypeSelect from './NewPodcast/NewPodcastTypeSelect.svelte';
	import NewEpisode from './NewEpisode/NewEpisode.svelte';
	import DuplicateEpisode from './DuplicateEpisode/DuplicateEpisode.svelte';
	import DigitalOceanSelector from './NewPodcast/DigitalOceanSelector.svelte';
	import DigitalOceanSetup from './NewPodcast/DigitalOceanSetup.svelte';
	import NewPublisher from './NewPublisher/NewPublisher.svelte';
	import PublisherImages from './NewPublisher/PublisherImages.svelte';
	import PublisherValue from './NewPublisher/PublisherValue.svelte';
	import PublisherItems from './NewPublisher/PublisherItems.svelte';

	$: console.log($newEditorScreen);
</script>

<section>
	<div class="head">
		<h2>
			{#if $newEditorScreen === 'newEpisode' || $newEditorScreen === 'duplicateEpisode'}
				{$editingEpisode?.title || `New Episode for ${$selectedPodcast?.title}`}
			{/if}
		</h2>
		<button
			class="primary"
			on:click={() => {
				editorDB.setItem('favorites', $podcastList);
				$showNewEditor = false;
				window.tinymce.get('tiny-editor-description').setContent($editingEpisode.description);
				$showSaved = true;
			}}
		>
			-close-
		</button>
	</div>

	{#if $rssData?.['podcast:medium'] === 'publisher'}
		<div class:hide={$newEditorScreen !== 'typeSelect'}>
			<NewPodcastTypeSelect />
		</div>
		<div class:hide={$newEditorScreen !== 'publisher'}>
			<NewPublisher />
		</div>
		<div class:hide={$newEditorScreen !== 'publisherImages'}>
			<PublisherImages />
		</div>
		<div class:hide={$newEditorScreen !== 'publisherItems'}>
			<PublisherItems />
		</div>
		<div class:hide={$newEditorScreen !== 'publisherValue'}>
			<PublisherValue />
		</div>
	{:else}
		<div class:hide={$newEditorScreen !== 'podcast'}>
			<NewPodcast />
		</div>
		<div class:hide={$newEditorScreen !== 'typeSelect'}>
			<NewPodcastTypeSelect />
		</div>
		<div class:hide={$newEditorScreen !== 'digitalOceanSelect'}>
			<DigitalOceanSelector />
		</div>
		<div class:hide={$newEditorScreen !== 'digitalOceanSetup'}>
			<DigitalOceanSetup />
		</div>
		<div class:hide={$newEditorScreen !== 'newEpisode'}>
			<NewEpisode />
		</div>

		{#if $newEditorScreen === 'duplicateEpisode'}
			<div>
				<DuplicateEpisode />
			</div>
		{/if}
	{/if}
</section>

<style>
	div {
		height: calc(100% - 42px);
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 42px;
	}

	.head h2 {
		margin: 0;
		padding: 0 8px;
	}

	section {
		position: fixed;
		top: 37px;
		left: 8px;
		height: calc(100% - 45px);
		width: calc(100% - 16px);
		overflow: hidden;
		border-radius: 8px;
		background-color: hsl(0, 0%, 98%);
		display: flex;
		flex-direction: column;
		z-index: 10;
		margin: 0px;
	}

	.hide {
		display: none;
	}

	button.primary {
		background-image: linear-gradient(to bottom, hsl(11, 100%, 37%), hsl(11, 100%, 27%));
		height: 27px;
		width: 90px;
		margin: 0 8px;
	}
</style>
