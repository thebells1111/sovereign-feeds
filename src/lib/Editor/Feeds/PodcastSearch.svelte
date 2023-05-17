<script>
	import ImageLoader from '$lib/Loaders/ImageLoader.svelte';
	import getRSSEditorFeed from '../_functions/getRSSFeed';
	import initializeRSSData from '../_functions/initializeRSSData';
	import initTinyMCE from '$lib/Editor/4-RightPane/TagEditor/ShowNotes/initTinyMCE';

	import {
		podcastSearchResults,
		selectedPodcast,
		episodesList,
		filteredEpisodesList,
		rightPane,
		xmlJson,
		editingEpisode,
		currentPage,
		digitalOceanEnabled,
		remoteServerUrl
	} from '$/editor';

	import { showMobile } from '$/stores';
	import { goto } from '$app/navigation';
	export let fromChapters;

	$: console.log($filteredEpisodesList);

	function fetchDOEnabled(podcast) {
		fetch(remoteServerUrl + `/api/sf/webhook?title=${podcast.title}`).then((res) =>
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

	async function getPodcast(podcast, index) {
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
				feed.episodes = data[1].items;
				$selectedPodcast = feed;
				$rightPane = 'episodeMetadata';
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

	let podcastBindings = [];
</script>

<ul>
	{#each $podcastSearchResults && $podcastSearchResults.feeds as podcast, index}
		<li
			data-id={podcast.id}
			data-_id={podcast._id}
			data-index={index}
			data-type="podcastList"
			bind:this={podcastBindings[index]}
			class="podcast-title"
			on:click={getPodcast.bind(null, podcast, index)}
		>
			<ImageLoader
				url={podcast?.artwork || podcast?.image}
				alt={`${podcast?.title} Logo`}
				title={podcast?.title}
				imageSize="50"
				styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
			/>
			<div class="title" class:selected={podcast.id === $selectedPodcast?.id}>
				{podcast?.title}
			</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
		height: calc(100% - 44px);
		overflow: auto;
		-webkit-user-select: none;
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
	.podcast-title:hover {
		background-color: var(--hover-color);
		background: linear-gradient(180deg, var(--selected-color) 33.333%, var(--hover-color) 100%);
	}

	.title {
		width: 100%;
	}
</style>
