<script>
	import setHeaderText from '$lib/Labels/setHeaderText';
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';
	import initializePublisherRSS from '$lib/Editor/Publisher/initializePublisherRSS';
	import initializeEpisode from '$lib/Editor/_functions/initializeEpisode';

	import {
		podcastList,
		selectedPodcast,
		editingEpisode,
		xmlJson,
		rssData,
		regularEpisodes,
		episodesList,
		newEditorScreen
	} from '$/editor';

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
		let feed = await getRSSEditorFeed(`${window.location.origin}/blankfeed.xml`);
		$xmlJson = feed;
		console.log(feed);
		await initializeRSSData();
		$episodesList = $regularEpisodes;
		initializeEpisode($regularEpisodes[0]);
		$editingEpisode = $regularEpisodes[0];
		$selectedPodcast.rss = $rssData;

		$podcastList = $podcastList.concat($selectedPodcast);
		console.log($podcastList);
	}

	async function addNewPublisher() {
		$selectedPodcast = {
			title: 'New Publisher Feed',
			url: `${window.location.origin}/blankpublisher.xml`,
			id: 'new',
			image: 'none',
			artwork: 'none'
		};
		console.log($selectedPodcast);
		let feed = await getRSSEditorFeed(`${window.location.origin}/blankpublisher.xml`);
		$xmlJson = feed;
		console.log(feed);
		await initializePublisherRSS();

		$selectedPodcast.rss = $rssData;

		$podcastList = $podcastList.concat($selectedPodcast);
		console.log($podcastList);
	}

	async function addNewPlaylist() {
		$selectedPodcast = {
			title: 'New Playlist',
			url: `${window.location.origin}/blankplaylist.xml`,
			id: 'new',
			image: 'none',
			artwork: 'none'
		};
		let feed = await getRSSEditorFeed(`${window.location.origin}/blankplaylist.xml`);
		$xmlJson = feed;
		await initializePublisherRSS();
		$selectedPodcast.rss = $rssData;
		$podcastList = $podcastList.concat($selectedPodcast);
	}
</script>

<div class="container">
	<h3>What type of feed are you looking to create?</h3>
	<div class="button-continer">
		<button
			class="primary"
			on:click={async () => {
				await addNewFeed();
				$rssData['podcast:medium'] = 'podcast';
				$newEditorScreen = 'podcast';
				setHeaderText($rssData);
			}}>Podcast</button
		>

		<button
			class="primary"
			on:click={async () => {
				await addNewFeed();
				$rssData['podcast:medium'] = 'music';
				$newEditorScreen = 'podcast';
				setHeaderText($rssData);
			}}>Music Album</button
		>

		<button
			class="primary"
			on:click={async () => {
				await addNewPublisher();
				$newEditorScreen = 'publisher';
				setHeaderText($rssData);
			}}>Publisher Feed</button
		>
		<button
			class="primary"
			on:click={async () => {
				await addNewPlaylist();
				$newEditorScreen = 'publisher';
				setHeaderText($rssData);
			}}>Music Playlist</button
		>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
