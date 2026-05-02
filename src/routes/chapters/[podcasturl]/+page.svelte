<script>
	import { onMount } from 'svelte';
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';
	import MiddlePane from '$lib/Editor/Episodes/Episodes.svelte';
	import {
		filteredEpisodesList,
		episodesList,
		selectedPodcast,
		podcastList,
		editorDB,
		xmlJson
	} from '$/editor';

	// Data returned from the load function is accessible via the 'data' prop
	export let data;
	$: ({ podcast, episodes } = data);

	onMount(async () => {
		if (podcast) {
			// Logic to sync your global stores
			if (!podcast.episodes) {
				podcast.item = episodes;
				$selectedPodcast = podcast;
				$episodesList = episodes;
				$filteredEpisodesList = episodes;
			}

			$podcastList = (await editorDB.getItem('favorites')) || [];

			const feed = await getRSSEditorFeed($selectedPodcast.url);
			$xmlJson = feed;
			initializeRSSData();
		}
	});
</script>

<MiddlePane fromChapters={true} />
