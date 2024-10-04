<script>
	import parser from 'fast-xml-parser';
	import JSZip from 'jszip';
	import pkg from 'file-saver';
	const { saveAs } = pkg;
	import clone from 'just-clone';
	import initializeRSSData from '../_functions/initializeRSSData';
	import { guidDupes, enclosureDupes } from '../_functions/getDupes';
	import cleanItems from '../_functions/cleanup/items';

	import cleanPodcastPerson from '../_functions/cleanup/podcastPerson';
	import cleanPodcastSocial from '../_functions/cleanup/social';

	import { rssData, episodesList, maxEpisodes } from '$/editor';

	import { xmlJson } from '$/editor';

	let js2xml = new parser.j2xParser({
		attributeNamePrefix: '@_',
		//attrNodeName: false,
		textNodeName: '#text',
		ignoreAttributes: false,
		ignoreNameSpace: false,
		format: true,
		indentBy: '  ',
		supressEmptyNode: true,
		attrValueProcessor: (val, attrName) => escapeHTML(`${val}`),
		tagValueProcessor: (val, tagName) => escapeHTML(`${val}`)
	});

	const escapeHTML = (str) =>
		str.replace(
			/[&<>'"]/g,
			(tag) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					"'": '&#39;',
					'"': '&quot;'
				})[tag]
		);

	// $: console.log(JSON.stringify($xmlJson));
	let rssDataProxy;

	async function parseRSS() {
		// checkDupes('title');
		// console.log(enclosureDupes($episodesList));
		// console.log(guidDupes($episodesList));
		let pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';
		rssDataProxy = clone($rssData);
		rssDataProxy.pubDate = pubDate;
		rssDataProxy.lastBuildDate = pubDate;
		cleanPodcastSocial(rssDataProxy);
		cleanPodcastPerson(rssDataProxy);
		cleanPodcastValue();

		delete rssDataProxy.item;
		rssDataProxy.item = clone($episodesList).splice(0, $maxEpisodes);
		cleanItems(rssDataProxy);
		console.log(rssDataProxy);
		$xmlJson.rss.channel = clone(rssDataProxy);
		$xmlJson.rss['@_version'] = '2.0';
		$xmlJson.rss['@_xmlns:itunes'] = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
		$xmlJson.rss['@_xmlns:content'] = 'http://purl.org/rss/1.0/modules/content/';
		$xmlJson.rss['@_xmlns:podcast'] =
			'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md';
		// initializeRSSData();

		var zip = new JSZip();
		zip.file('feed.xml', js2xml.parse($xmlJson));
		let content = await zip.generateAsync({ type: 'blob' });
		// see FileSaver.js
		saveAs(content, 'example.zip');
		// initializeRSSData();
	}

	function cleanPodcastValue() {
		if (rssDataProxy['podcast:value']) {
			if (
				!rssDataProxy['podcast:value']['podcast:valueRecipient'][0]['@_address'] ||
				!rssDataProxy['podcast:value']['podcast:valueRecipient'][0]['@_split']
			) {
				delete rssDataProxy['podcast:value'];
			} else {
				rssDataProxy['podcast:value']['podcast:valueRecipient'] = rssDataProxy['podcast:value'][
					'podcast:valueRecipient'
				].filter((v) => {
					if (!v['@_name']) {
						delete v['@_name'];
					}
					if (!v['@_customKey']) {
						delete v['@_customKey'];
					}
					if (!v['@_customValue']) {
						delete v['@_customValue'];
					}
					if (!v['@_fee']) {
						delete v['@_fee'];
					}
					return v;
				});
			}
		}
	}
</script>

<button on:click={parseRSS}>Create RSS File</button>

<style>
	button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 0;
		min-height: 36px;
		width: 90%;
		margin: 8px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(to bottom, rgb(68, 68, 68), #000);
		box-shadow:
			inset 0 1px rgb(109, 109, 109),
			0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow:
			1px 4px 6px rgb(82, 82, 82),
			0 0 0 #000,
			1px 4px 6px rgb(82, 82, 82);
	}

	button:hover {
		background-color: black;
		color: white;
	}

	button:active {
		background-color: #333;
		color: #eee;
	}
</style>
