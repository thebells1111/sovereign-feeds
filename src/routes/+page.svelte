<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';

	import Editor from '$lib/Editor/Editor.svelte';
	import CreateEpisode from '$lib/Modals/CreateEpisode/CreateEpisode.svelte';
	import Saved from '$lib/Modals/Saved/Saved.svelte';
	import ServerSending from '$lib/Modals/ServerSending/ServerSending.svelte';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';

	import { showCreateEpisode, showMobile } from '$/stores';
	import {
		showSaved,
		editorDB,
		podcastList,
		showServerSending,
		selectedPodcast,
		currentPage,
		feedText,
		xmlJson
	} from '$/editor';

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
