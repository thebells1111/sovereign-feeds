import { get } from 'svelte/store';

import parser from 'fast-xml-parser';
import clone from 'just-clone';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
import cleanItems from '$lib/Editor/_functions/cleanup/items';

import cleanPodcastPerson from '$lib/Editor/_functions/cleanup/podcastPerson';
import cleanComplete from '$lib/Editor/_functions/cleanup/complete';
import cleanLocked from '$lib/Editor/_functions/cleanup/locked';
import cleanLicense from '$lib/Editor/_functions/cleanup/license';
import cleanPodroll from '$lib/Tags/Podroll/cleanPodroll';
import cleanPodcastImages from '../_functions/cleanup/images';
import cleanExperimentalImages from '$lib/Tags/Images/cleanImages';
import cleanFunding from '$lib/Tags/Funding/cleanFunding';

import {
	rssData,
	maxEpisodes,
	xmlJson,
	regularEpisodes,
	liveEpisodes,
	remoteServerUrl,
	selectedPodcast
} from '$/editor';

let js2xml = new parser.j2xParser({
	attributeNamePrefix: '@_',
	//attrNodeName: false,
	textNodeName: '#text',
	ignoreAttributes: false,
	ignoreNameSpace: false,
	format: true,
	indentBy: '  ',
	supressEmptyNode: true,
	attrValueProcessor: (val, attrName) => escapeAttr(`${val}`),
	tagValueProcessor: (val, tagName) => escapeTag(`${val}`)
});

const escapeAttr = (str) =>
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

const escapeTag = (str) => {
	if (str.match(/[&<>'"]/g)) {
		return '<![CDATA[' + str + ']]>';
	}
	return str;
};

let rssDataProxy;

export default async function buildRSS() {
	let $regularEpisodes = get(regularEpisodes);
	let $liveEpisodes = get(liveEpisodes);
	let allEpisodes = $regularEpisodes.concat($liveEpisodes);

	let guidDupes = getDuplicateGuids(allEpisodes);

	if (Object.keys(guidDupes).length > 0) {
		let alertText = 'The following episodes share a guid: ';
		for (let guid in guidDupes) {
			alertText += '\n\nGuid:\n    ' + guid + '\nEpisodes\n    ' + guidDupes[guid].join('\n    ');
		}
		alert(alertText);
		return {};
	}

	let $maxEpisodes = get(maxEpisodes);
	let $xmlJson = get(xmlJson);
	let $rssData = get(rssData);
	let pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';
	rssDataProxy = clone($rssData);
	rssDataProxy.pubDate = pubDate;
	rssDataProxy.lastBuildDate = pubDate;

	createCategory();
	cleanLink(rssDataProxy);
	cleanPodcastPerson(rssDataProxy);
	cleanPodcastValue();
	cleanPodcastImages(rssDataProxy);
	cleanExperimentalImages(rssDataProxy);
	cleanChannelImage();
	cleanComplete(rssDataProxy);
	cleanLocked(rssDataProxy);
	cleanLicense(rssDataProxy);
	cleanFunding(rssDataProxy);
	changeGenerator(rssDataProxy);
	await cleanGuid(rssDataProxy);
	cleanPodroll(rssDataProxy);
	delete rssDataProxy.item;
	delete rssDataProxy['podcast:liveItem'];

	if (!['publisher', 'musicL'].find((v) => v === $rssData?.['podcast:medium'])) {
		rssDataProxy['podcast:liveItem'] = clone($liveEpisodes).splice(0, get(maxEpisodes));
		rssDataProxy.item = clone($regularEpisodes).splice(0, $maxEpisodes);

		await cleanItems(rssDataProxy);
	}
	if (!$xmlJson) {
		$xmlJson = await getRSSEditorFeed(`${window.location.origin}/blankfeed.xml`);
	}
	$xmlJson.rss.channel = clone(rssDataProxy);
	$xmlJson.rss['@_version'] = '2.0';
	$xmlJson.rss['@_xmlns:itunes'] = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
	$xmlJson.rss['@_xmlns:podcast'] =
		'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md';
	// initializeRSSData();

	xmlJson.set($xmlJson);

	console.log('rss: ', rssDataProxy);
	let xml = js2xml.parse($xmlJson);
	return { title: rssDataProxy.title, xmlFile: xml };
}

function createCategory() {
	if (rssDataProxy?.['itunes:category']?.[0]?.['@_text']) {
		console.log('bitch');
		rssDataProxy.category = rssDataProxy['itunes:category'].map((item) => item['@_text']);
	} else {
		delete rssDataProxy.category;
		delete rssDataProxy['itunes:category'];
	}
}

function cleanLink(data) {
	if (!data.link) {
		delete data.link;
	}
}

function cleanPodcastValue() {
	if (rssDataProxy['podcast:value']) {
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
			if (!v['@_address'] || !v['@_split']) {
				return false;
			}
			//use this to update address for SF
			if (
				v['@_address'] === '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3' &&
				v['@_customValue'] === 'eChoVKtO1KujpAA5HCoB'
			) {
				v['@_address'] = '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8';
				delete v['@_customKey'];
				delete v['@_customValue'];
			}
			return v;
		});
	}

	if (
		!rssDataProxy?.['podcast:value']?.['podcast:valueRecipient']?.[0]?.['@_address'] ||
		!rssDataProxy?.['podcast:value']?.['podcast:valueRecipient']?.[0]?.['@_split']
	) {
		delete rssDataProxy['podcast:value'];
	}
}

function cleanChannelImage() {
	let image = {};
	if (rssDataProxy?.['itunes:image']?.['@_href']) {
		image.url = rssDataProxy?.['itunes:image']?.['@_href'];
		if (rssDataProxy.link) {
			image.link = rssDataProxy.link;
		}
		if (rssDataProxy.title) {
			image.title = rssDataProxy.title;
		}
		if (rssDataProxy.description) {
			image.description = rssDataProxy.description;
		}

		(image.width = 144), (image.height = 144);

		rssDataProxy.image = image;
	} else {
		delete rssDataProxy.image;
	}
}

function changeGenerator(data) {
	data.generator = 'Sovereign Feeds';
}

function getDuplicateGuids(episodes) {
	let guidMap = {};
	let guidDupes = {};

	episodes.forEach((episode) => {
		let guid = episode.guid?.['#text'] || episode.guid;
		if (!guidMap[guid]) {
			guidMap[guid] = [];
		}
		guidMap[guid].push(episode.title);
	});

	for (let guid in guidMap) {
		if (guidMap[guid].length > 1) {
			guidDupes[guid] = guidMap[guid];
		}
	}

	return guidDupes;
}

async function cleanGuid(rss) {
	let isValidGuid = checkValidGuid(rss['podcast:guid']);

	if (!isValidGuid) {
		let guid = await generateValidGuid();
		rss['podcast:guid'] = guid;
		get(selectedPodcast).podcastGuid = guid;
	}
}

function checkValidGuid(input) {
	const regex = new RegExp(
		'^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$'
	);
	return regex.test(input);
}

async function generateValidGuid() {
	const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
	const inputString = uuidv4();
	const uniqueId = uuidv5(inputString, namespace);

	let url =
		remoteServerUrl + `/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${uniqueId}`)}`;

	const res = await fetch(url);
	const data = await res.json();
	if (data?.feed?.length) {
		return generateValidGuid();
	} else {
		return uniqueId;
	}
}
