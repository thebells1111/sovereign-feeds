<script context="module">
	export async function load({ params, fetch }) {
		let podcasturl = params.podcasturl;
		let urls = [
			`/api/queryindex?q=podcasts/byfeedurl?url=${podcasturl}`,
			`/api/queryindex?q=episodes/byfeedurl?url=${podcasturl}`
		];
		let data = await Promise.all(urls.map((url) => fetch(url).then((data) => data.json())));

		let podcast;
		let episodes = [];

		if (data[0].status) {
			podcast = data[0].feed;
			episodes = data[1].items;
		}

		return {
			props: {
				podcast: podcast,
				episodes: episodes
			}
		};
	}
</script>

<script>
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';

	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';
	import MiddlePane from '$lib/Editor/Episodes/Episodes.svelte';
	import { onMount } from 'svelte';
	import {
		filteredEpisodesList,
		episodesList,
		selectedPodcast,
		podcastList,
		editorDB,
		xmlJson
	} from '$/editor';

	export let episodes;
	export let podcast;

	onMount(async () => {
		if (!podcast?.episodes) {
			podcast.episodes = episodes;
			$selectedPodcast = podcast;
			$episodesList = episodes;
			$filteredEpisodesList = episodes;
		}
		$podcastList = (await editorDB.getItem('favorites')) || [];
		getRSSEditorFeed($selectedPodcast.url).then((feed) => {
			$xmlJson = feed;
			initializeRSSData();
		});
	});
</script>

<MiddlePane fromChapters={true} />
