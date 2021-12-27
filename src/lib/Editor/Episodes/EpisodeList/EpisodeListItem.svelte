<script>
	import stripHtml from 'striptags';
	import prettyDate from '$functions/prettyDate';

	import initializeEpisode from '../../_functions/initializeEpisode';
	import cleanEpisode from '../../_functions/cleanup/items';

	import initTinyMCE from '../../4-RightPane/TagEditor/ShowNotes/initTinyMCE';
	import Delete from '$lib/icons/Delete.svelte';

	import {
		editingEpisode,
		editingIndex,
		showLiveEpisodes,
		episodesList,
		selectedPodcast,
		filteredEpisodesList,
		maxEpisodes,
		currentPage,
		liveEpisodes,
		regularEpisodes
	} from '$/editor';

	import { showMobile } from '$/stores';

	import { goto } from '$app/navigation';

	export let episode;
	export let episodeIndex;
	export let fromChapters = false;

	function makeSnippet(string) {
		if (typeof string === 'string') {
			let s = stripTags(decode(string)).substring(0, 105);
			return `${s.substr(0, s.lastIndexOf(' '))} ...`;
		}
		return '';

		function decode(str) {
			return str.replace(/&#(\d+);/g, function (match, dec) {
				return String.fromCharCode(dec);
			});
		}
		function stripTags(str) {
			return str.replace(/(<([^>]+)>)/gi, '');
		}
	}

	async function selectEpisode(episode, slide) {
		$currentPage = 'editor';
		console.log(episode);
		$editingEpisode = $showLiveEpisodes
			? $liveEpisodes.find((v) => v.sfID === episode.sfID)
			: $regularEpisodes.find((v) => v.sfID === episode.sfID);
		console.log($editingEpisode);
		$editingIndex = episodeIndex;
		initializeEpisode($editingEpisode, $showLiveEpisodes ? 'live' : null);

		if (!window?.tinymce?.activeEditor && !fromChapters) {
			initTinyMCE();
		}
		window?.tinymce?.activeEditor?.setContent(episode?.description || '');

		// episode = $editingEpisode;
		if (fromChapters) {
			goto(
				`/chapters/${window.location.href.split('chapters/')[1]}/${encodeURIComponent(
					episode?.enclosure?.['@_url'] || episode.enclosureUrl
				)}`
			);
		}
	}

	function handleDelete(e) {
		let text = 'Are you sure you want to delete this episode?';
		if (confirm(text) == true) {
			deleteEpisode();
		}
		console.log(text);
	}

	async function deleteEpisode() {
		$episodesList.splice(episodeIndex, 1);

		$episodesList = $episodesList;
		$selectedPodcast.episodes = $episodesList;
		$selectedPodcast.rss.item = $episodesList;

		$filteredEpisodesList = $episodesList.slice(0, $maxEpisodes);
		console.log($selectedPodcast.rss);
	}
</script>

<div class="container" class:selected={episode === $editingEpisode}>
	<div
		on:click={selectEpisode.bind(this, episode)}
		class="description"
		class:selected={episode === $editingEpisode}
	>
		<div class="head">
			<h1>{episode?.title}</h1>
			{#if !$showMobile}
				<button on:click|stopPropagation={handleDelete}><Delete size="20px" /></button>
			{/if}
		</div>
		<div>
			<p>{makeSnippet(stripHtml(episode?.description))}</p>
		</div>
	</div>
</div>

<style>
	.container {
		height: 100%;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.description {
		width: 100%;
		margin: 0;
		padding: 8px;
		border-bottom: 1px solid var(--border-color);
	}

	.description:hover {
		background-color: var(--hover-color);
		background: linear-gradient(
			180deg,
			var(--episode-card-selected) 33.333%,
			var(--episode-card-color) 100%
		);
	}

	:global(p) {
		height: auto;
		padding: 0 0 1em 0.75em;
		margin: 0;
	}

	h1 {
		width: 100%;
		margin: 0.5em 0 0.125em 0;
		font-size: 1.17em;
		font-weight: bolder;
	}

	.head {
		display: flex;
		justify-content: space-between;
	}

	.head > div {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.head > div > p {
		font-size: 0.8em;
		margin: 0 1em;
	}

	button {
		background-color: transparent;
		color: rgb(168, 168, 168);
		border: none;
		padding: 0;
		margin-top: 8px;
	}

	button:hover {
		color: red;
	}

	.container.selected h1,
	.container.selected p {
		color: var(--episode-selected-text-color);
	}

	.container:hover h1,
	.container:hover p {
		color: var(--episode-hover-text-color);
	}
</style>
