<script>
	import ImageLoader from '$lib/Loaders/ImageLoader.svelte';
	import SubscriptionContextMenu from './SubscriptionContextMenu.svelte';
	import initTinyMCE from '$lib/Editor/4-RightPane/TagEditor/ShowNotes/initTinyMCE';
	import Cancel from '$lib/icons/CancelFilled.svelte';

	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';
	import initializeEpisode from '$lib/Editor/_functions/initializeEpisode';

	import Sync from '$lib/icons/Sync.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { devMode, serverUrl, showMobile } from '$/stores';

	import {
		podcastList,
		selectedPodcast,
		editingEpisode,
		editorDB,
		rightPane,
		xmlJson,
		rssData,
		showLiveEpisodes,
		regularEpisodes,
		showNewEditor,
		episodesList,
		newEditorScreen,
		expandPodcastList,
		currentPage,
		digitalOceanEnabled,
		remoteServerUrl
	} from '$/editor';

	export let fromChapters = false;

	export let showSyncModal = false;
	export let syncText = 'confirm';
	export let isSyncing = false;
	let showNotAvailable = false;

	onMount(async () => {
		$podcastList = (await editorDB.getItem('favorites')) || [];
	});

	function fetchDOEnabled(podcast) {
		fetch(remoteServerUrl + `/api/sf/webhook?title=${podcast.title}`, {
			credentials: 'include'
		}).then((res) =>
			res.json().then((data) => {
				console.log(data);
				$digitalOceanEnabled =
					data?.webhooks?.DO_ENABLED &&
					data?.webhooks?.DO_BUCKET &&
					data?.webhooks?.DO_ENDPOINT &&
					data?.webhooks?.DO_ACCESS_KEY &&
					data?.webhooks?.DO_SECRET_KEY;
			})
		);
	}

	async function getPodcast(podcast) {
		console.log(podcast);
		fetchDOEnabled(podcast);
		console.log($episodesList);
		$currentPage = 'episodes';

		// $expandPodcastList = false;
		let url = remoteServerUrl + `/api/queryindex?q=podcasts/byfeedid?id=` + podcast.id;
		fetch(url).then((res) =>
			res.json().then((data) => {
				if (podcast.lastUpdateTime < data?.feed?.lastUpdateTime) {
					showSyncModal = true;
					syncText = 'auto';
				}
			})
		);
		$showLiveEpisodes = false;
		$selectedPodcast = podcast;

		$rightPane = 'episodeMetadata';
		if (podcast.rss) {
			console.log(podcast);
			$xmlJson = podcast.xml;
			await initializeRSSData(podcast.rss);
			console.log(podcast.rss);
			$selectedPodcast.rss = $rssData;
		} else if (!fromChapters) {
			syncWithFeed(podcast);
		}

		console.log($episodesList);

		$editingEpisode = $episodesList[0];

		if (fromChapters) {
			if (
				podcast.url === 'https://sovereignfeeds.com/blankfeed.xml' ||
				podcast.url === 'http://localhost:3333/blankfeed.xml'
			) {
				showNotAvailable = true;
			} else {
				goto(`/chapters/${encodeURIComponent(podcast.url)}`);
				console.log(podcast.url);
			}
		}
	}

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

	let podcastBindings = [];

	async function addNewFeed() {
		$selectedPodcast = {
			title: 'New Podcast',
			url: `${window.location.origin}/blankfeed.xml`,
			id: 'new',
			image: 'none',
			artwork: 'none',
			episodes: [
				{
					title: 'New Episode',
					description: ''
				}
			]
		};
		getRSSEditorFeed(`${window.location.origin}/blankfeed.xml`).then(async (feed) => {
			$xmlJson = feed;
			console.log(feed);
			await initializeRSSData();
			$episodesList = $regularEpisodes;
			initializeEpisode($regularEpisodes[0]);
			$editingEpisode = $regularEpisodes[0];
			$selectedPodcast.rss = $rssData;
		});

		$podcastList = $podcastList.concat($selectedPodcast);
		console.log($podcastList);
	}
</script>

{#if $podcastList.length > 0}
	<ul>
		{#each $podcastList as podcast, index}
			<li
				data-id={podcast.id}
				data-_id={podcast._id}
				data-index={index}
				data-type="podcastList"
				bind:this={podcastBindings[index]}
				class="podcast-title"
				class:selected={podcast.id === $selectedPodcast?.id}
				on:click={getPodcast.bind(null, podcast)}
			>
				<ImageLoader
					url={podcast?.rss?.['itunes:image']?.['@_href'] ||
						podcast?.artwork ||
						podcast?.image ||
						'./SF192.png'}
					alt={`${podcast?.rss?.title || podcast?.title} Logo`}
					title={podcast?.rss?.title || podcast?.title}
					imageSize="50"
					styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
				/>
				<div class="title" class:selected={podcast.id === $selectedPodcast?.id}>
					{podcast?.rss?.title || podcast?.title}
				</div>
				{#if podcast.id != 'new' && !fromChapters}
					<button
						class="podcast-sync"
						on:click={() => {
							showSyncModal = true;
							syncText = 'confirm';
						}}
					>
						<Sync size="24px" />
					</button>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	<p>Search for your podcasts and add them to your favorites.</p>
{/if}

{#if !fromChapters}
	<div class="new-podcast-container">
		<button
			class="fancy new-podcast"
			on:click={() => {
				addNewFeed();
				$showNewEditor = true;
				$newEditorScreen = 'typeSelect';
				$expandPodcastList = false;
			}}
		>
			Create New Feed
		</button>
	</div>
{/if}
<SubscriptionContextMenu />

<div class="not-available" class:show={showNotAvailable}>
	<div
		class="cancel"
		on:click={() => {
			showNotAvailable = false;
		}}
	>
		<Cancel size="30" />
	</div>
	<h3>Chapters are not yet available for New Podcasts.</h3>
	<h3>
		Please upload your podcast to the <a href="https://podcastindex.org/add">Podcast Index</a>.
	</h3>
	<h3>
		In about thirty minutes, do a search for your podcast in the 'find for your podcasts' bars, and
		add your podcast to your favorites.
	</h3>
</div>

<style>
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
	ul {
		padding: 0;
		margin: 0;
		height: calc(100% - 44px);
		overflow: auto;
	}

	p {
		padding: 0;
		margin: 0;
		height: calc(100% - 44px);
		overflow: auto;
	}

	li {
		list-style-type: none;
	}

	.podcast-title {
		display: flex;
		align-items: center;
		overflow: hidden;
		width: 100%;
		padding: 4px;
		margin: 0;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid var(--border-color);
		height: auto;
	}
	.podcast-title.selected {
		background-color: var(--selected-color);
		background: linear-gradient(180deg, var(--secondary-color) 33.333%, var(--selected-color) 100%);
		color: rgb(27, 111, 246);
	}

	.podcast-title:hover {
		background-color: var(--hover-color);
		background: linear-gradient(180deg, var(--selected-color) 33.333%, var(--hover-color) 100%);
	}

	.title {
		width: 100%;
	}

	.podcast-sync {
		height: 100%;
		margin: 0;
		background-color: transparent;
		display: grid;
		place-content: center;
		border: none;
	}

	.podcast-sync:hover {
		color: hsla(197, 100%, 43.7%, 1);
	}

	.new-podcast-container {
		width: 100%;
	}
	.new-podcast {
		background-image: linear-gradient(to bottom, hsl(226, 82%, 50%), hsl(226, 82%, 30%));
		width: 240px;
		margin: 0 auto;
		padding: 4px 0;
		float: right;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	.not-available {
		position: absolute;
		max-width: 500px;
		background-color: white;
		border-radius: 8px;
		margin: 60px auto;
		padding: 8px;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
		text-align: center;
		display: none;
	}

	.not-available a {
		color: hsl(20, 100%, 33%);
	}

	.cancel {
		position: absolute;
		right: 8px;
		color: hsl(20, 100%, 33%);
		cursor: pointer;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
		display: grid;
		place-content: center;
		border-radius: 30px;
		width: 24px;
		height: 24px;
	}

	.show {
		display: initial;
	}
</style>
