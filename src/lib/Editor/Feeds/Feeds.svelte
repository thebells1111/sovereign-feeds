<script>
	import Header from './Header/PodcastListHeader.svelte';
	import ListTypeDisplay from './ListTypeDisplay.svelte';
	import SubscriptionList from './SubscriptionList.svelte';
	import PodcastSearch from './PodcastSearch.svelte';
	import getRSSEditorFeed from '../_functions/getRSSFeed';
	import initializeRSSData from '../_functions/initializeRSSData';
	import initTinyMCE from '$lib/Tags/ShowNotes/initTinyMCE';

	import {
		podcastSearchResults,
		rightPane,
		xmlJson,
		editingEpisode,
		currentPage,
		digitalOceanEnabled,
		remoteServerUrl,
		selectedPodcast
	} from '$/editor';

	import { showMobile } from '$/stores';
	import { goto } from '$app/navigation';

	export let fromChapters = false;

	export let showSyncModal = false;
	export let syncText = 'confirm';
	export let isSyncing = false;

	function fetchDOEnabled(podcast) {
		fetch(remoteServerUrl + `/api/sf/webhook?title=${podcast.title}`, {
			credentials: 'include'
		}).then((res) =>
			res.json().then((data) => {
				$digitalOceanEnabled =
					data?.webhooks?.DO_ENABLED &&
					data?.webhooks?.DO_BUCKET &&
					data?.webhooks?.DO_ENDPOINT &&
					data?.webhooks?.DO_ACCESS_KEY &&
					data?.webhooks?.DO_SECRET_KEY;
			})
		);
	}

	function handlePodcastSelect(podcast) {
		console.log(podcast);
		fetchDOEnabled(podcast);
		$currentPage = 'episodes';

		let urls = [
			remoteServerUrl + `/api/queryindex?q=podcasts/byfeedid?id=` + podcast.id,
			remoteServerUrl +
				`/api/queryindex?q=episodes/byfeedid?` +
				encodeURIComponent(`id=${podcast.id}&max=1000&fulltext`)
		];
		Promise.all(urls.map((url) => fetch(url).then((response) => response.json()))).then((data) => {
			if (data[0].status) {
				let feed = data[0].feed;
				feed.item = data[1].items;
				$selectedPodcast = feed;
				$rightPane = 'episodeMetadata';
				if (feed.medium === 'publisher') {
					$currentPage = 'podcastMetadata';
				}

				getRSSEditorFeed($selectedPodcast.url).then((feed) => {
					console.log(feed);
					$xmlJson = feed;
					initializeRSSData();
					if (!window?.tinymce?.activeEditor && !$showMobile) {
						initTinyMCE();
					}
					window?.tinymce?.activeEditor?.setContent($editingEpisode?.description || '');
				});
			}
		});
		console.log(podcast.url);
		if (fromChapters) {
			goto(`/chapters/${encodeURIComponent(podcast.url)}`);
			console.log(podcast.url);
		}
	}
</script>

<div class="podcast-list">
	<div class="head">
		<Header />
		<ListTypeDisplay />
	</div>

	{#if $podcastSearchResults?.feeds}
		<PodcastSearch {fromChapters} {handlePodcastSelect} />
	{:else}
		<SubscriptionList {fromChapters} bind:showSyncModal bind:syncText bind:isSyncing />
	{/if}
</div>

<style>
	.podcast-list {
		height: 100%;
		overflow: hidden;
		padding: 0;
		display: flex;
		flex-direction: column;
		padding-bottom: 8px;
	}
</style>
