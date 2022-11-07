<script context="module">
	export const prerender = true;
</script>

<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';
	import { page } from '$app/stores';

	const token = $page.url.searchParams.get('token');

	import Editor from '$lib/Editor/Editor.svelte';
	import CreateEpisode from '$lib/Modals/CreateEpisode/CreateEpisode.svelte';
	import Saved from '$lib/Modals/Saved/Saved.svelte';
	import ServerSending from '$lib/Modals/ServerSending/ServerSending.svelte';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';

	import { showCreateEpisode, showMobile, serverUrl, loggedIn } from '$/stores';
	import {
		showSaved,
		editorDB,
		podcastList,
		showServerSending,
		selectedPodcast,
		filteredEpisodesList,
		episodesList,
		currentPage,
		feedText,
		xmlJson
	} from '$/editor';

	if (token) {
		verifyToken(token);
	}

	async function verifyToken(token) {
		history.pushState(null, null, '/');
		try {
			let response = await fetch(serverUrl + `verify-token?token=` + token, {
				credentials: 'include'
			});
			if (response.status === 200) {
				let data = await response.json();
				console.log(data);
				if (data.status === 'success') {
					loggedIn.set(true);
				}
				return data.user;
			} else {
				return {};
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function saveManualChanges() {
		const parserOptions = {
			attributeNamePrefix: '@_',
			//attrNodeName: false,
			//textNodeName : "#text",
			ignoreAttributes: false,
			ignoreNameSpace: false,
			attrValueProcessor: (val, attrName) => decode(val), //default is a=>a
			tagValueProcessor: (val, tagName) => decode(val) //default is a=>a
		};

		let xml2Json = parse($feedText, parserOptions);

		$xmlJson = xml2Json;

		$selectedPodcast.xml = $xmlJson;
		$selectedPodcast.rss = $xmlJson.rss.channel;
		// $rssData = $xmlJson.rss.channel;
		await initializeRSSData($selectedPodcast.rss);

		/* add error handling */
	}

	async function checkSave(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					event.preventDefault();
					console.log($selectedPodcast);
					if ($currentPage === 'manual') {
						await saveManualChanges();
					}

					$showSaved = true;
					editorDB.setItem('favorites', $podcastList);
					break;
			}
		}
	}
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let mounted = false;
	// onMount(() => {
	// 	$selectedPodcast = null;
	// 	$episodesList = null;
	// 	$filteredEpisodesList = null;
	// 	mounted = true;
	// 	console.log('mount');
	// });

	// $: if (mounted && $showMobile) {
	// 	$selectedPodcast = null;
	// 	$episodesList = null;
	// 	$filteredEpisodesList = null;
	// 	if ($showMobile) {
	// 		goto('/chapters');
	// 	}
	// }

	$: console.log('sm: ', $showMobile);
</script>

<svelte:window on:keydown={checkSave} />

<Editor />

{#if $showCreateEpisode}
	<CreateEpisode />
{/if}

{#if $showSaved}
	<Saved />
{/if}

{#if $showServerSending}
	<ServerSending />
{/if}
