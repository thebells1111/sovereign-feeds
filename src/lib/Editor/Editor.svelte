<script>
	import LeftPane from './2-LeftPane/LeftPane.svelte';
	import Episodes from './Episodes/Episodes.svelte';
	import Editor from './4-RightPane/TagEditor/Editor.svelte';
	import Feeds from './Feeds/Feeds.svelte';
	import Webhooks from './Webhooks/Webhooks.svelte';
	import Manual from './Manual/Manual.svelte';
	import Publish from './Publish/Publish.svelte';
	import Podping from './Podping/PodPing.svelte';
	import PodcastMetadata from './Channel/Channel.svelte';
	import Sync from '$lib/icons/Sync.svelte';

	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';
	import initTinyMCE from '$lib/Editor/4-RightPane/TagEditor/ShowNotes/initTinyMCE';

	import { showMobile } from '$/stores';
	import {
		currentPage,
		podcastList,
		selectedPodcast,
		editingEpisode,
		editorDB,
		rightPane,
		xmlJson,
		rssData,
		remoteServerUrl
	} from '$/editor';

	let showSyncModal = false;
	let syncText = 'confirm';
	let isSyncing = false;

	async function syncWithFeed(podcast) {
		if (podcast.id) {
			isSyncing = true;
			let urls = [
				remoteServerUrl + `/api/queryindex?q=podcasts/byfeedid?id=` + podcast.id,
				remoteServerUrl +
					`/api/queryindex?q=episodes/byfeedid?` +
					encodeURIComponent(`id=${podcast.id}&max=1000&fulltext`)
			];
			Promise.all(urls.map((url) => fetch(url).then((response) => response.json()))).then(
				(data) => {
					if (data[0].status) {
						let feed = data[0].feed;
						feed.episodes = data[1].items;
						$selectedPodcast = feed;
						$rightPane = 'episodeMetadata';
						getRSSEditorFeed($selectedPodcast.url).then(async (feed) => {
							console.log(feed);
							$xmlJson = feed;
							await initializeRSSData();
							$selectedPodcast.rss = $rssData;
							$selectedPodcast.xml = $xmlJson;
							$selectedPodcast.artwork = $rssData['itunes:image']['@_href'];
							$selectedPodcast.title = $rssData.title;
							// podcast.image = $rssData['itunes:image']['@_href'];
							// console.log(podcast);
							if (!window?.tinymce?.activeEditor && !$showMobile) {
								initTinyMCE();
							}

							window?.tinymce?.activeEditor?.setContent($editingEpisode?.description || '');

							let i = $podcastList.findIndex(({ id }) => id === $selectedPodcast.id);
							$podcastList[i] = $selectedPodcast;
							$podcastList = $podcastList;
							editorDB.setItem('favorites', $podcastList);
							isSyncing = false;
						});
					}
				}
			);
		} else {
			isSyncing = false;
		}
	}
</script>

<div class="container">
	<div class="left-pane">
		<LeftPane />
	</div>
	<div class="right-pane">
		<div class:hide={$currentPage !== 'feeds'}>
			<Feeds bind:showSyncModal bind:syncText bind:isSyncing />
		</div>
		<div class:hide={$currentPage !== 'episodes'}>
			<Episodes />
		</div>
		<div class:hide={$currentPage !== 'editor'}>
			<Editor />
		</div>
		<div class:hide={$currentPage !== 'webHooks'}>
			<Webhooks />
		</div>
		<div class:hide={$currentPage !== 'manual'}>
			<Manual />
		</div>
		<div class:hide={$currentPage !== 'publish'}>
			<Publish />
		</div>
		<div class:hide={$currentPage !== 'podping'}>
			<Podping />
		</div>
		<div class:hide={$currentPage != 'podcastMetadata'}>
			<PodcastMetadata />
		</div>
		{#if $currentPage === 'webhooks'}
			<div>
				<Webhooks />
			</div>
		{/if}
	</div>
</div>

{#if isSyncing}
	<div class="sync-modal">
		<div class="sync-container">
			<div class="syncing-feed">
				<h1>Syncing Feed</h1>
				<div class="animated-sync"><Sync size="9em" /></div>
			</div>
		</div>
	</div>
{/if}

{#if showSyncModal}
	<div class="sync-modal">
		<div class="sync-container">
			{#if syncText === 'confirm'}
				<h3>Are you sure you want to sync your saved data with your RSS feed?</h3>
				<h3>
					Doing so will overwrite any changes you've made since you last uploaded your RSS feed.
				</h3>
			{:else if syncText === 'auto'}
				<h3>Your saved data is older than the data in your RSS feed.</h3>
				<h3>Would you like to sync your saved date with your RSS feed?</h3>
			{/if}
			<div class="button-container">
				<button
					class="primary"
					on:click={() => {
						showSyncModal = false;
						syncWithFeed($selectedPodcast);
					}}
				>
					Yes
				</button>
				<button
					class="primary cancel-sync"
					on:click={() => {
						showSyncModal = false;
					}}
				>
					No
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	div {
		overflow: auto;
	}

	.container {
		width: 100%;
		height: 100%;
		background-color: white;
		border-radius: 8px;
		padding: 8px;
		border: 1px solid var(--border-color);
		display: flex;
	}

	.left-pane {
		width: 200px;
		border-right: 1px solid var(--border-color);
		transition: min-width 0.33s;
		padding-right: 8px;
	}

	.right-pane {
		flex-grow: 1;
		grid-area: right-pane;
		padding-left: 8px;
		width: calc(100% - 620px);
	}

	.right-pane > div {
		height: 100%;
	}

	.sync-modal {
		position: absolute;
		width: calc(100% + 8px);
		height: calc(100% + 48px);
		left: -8px;
		top: -48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.sync-container {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}

	.sync-container h3 {
		padding: 0;
		margin: 0 0 8px 0;
	}

	.button-container {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		margin-top: 8px;
	}

	button.cancel-sync {
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	.syncing-feed {
		height: 200px;
		width: 250px;
		display: grid;
		place-content: center;
		position: relative;
		overflow: hidden;
	}

	.syncing-feed h1 {
		margin: 30px 0 0 0;
	}

	.animated-sync {
		width: 200px;
		height: 200px;
		animation-name: rotate;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		border-radius: 50%;
		display: grid;
		place-content: center;
		position: relative;
		top: -21px;
	}

	.hide {
		display: none;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
</style>
