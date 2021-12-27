import { get } from 'svelte/store';

import parser from 'fast-xml-parser';
import clone from 'just-clone';
import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
import cleanItems from '$lib/Editor/_functions/cleanup/items';

import cleanPodcastPerson from '$lib/Editor/_functions/cleanup/podcastPerson';
import cleanPodcastImages from '$lib/Editor/_functions/cleanup/images';
import cleanComplete from '$lib/Editor/_functions/cleanup/complete';
import cleanLocked from '$lib/Editor/_functions/cleanup/locked';

import { rssData, maxEpisodes, xmlJson, regularEpisodes, liveEpisodes } from '$/editor';

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
			}[tag])
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
	let $maxEpisodes = get(maxEpisodes);
	let $xmlJson = get(xmlJson);
	let $rssData = get(rssData);
	let pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';
	console.log($xmlJson);
	rssDataProxy = clone($rssData);
	rssDataProxy.pubDate = pubDate;
	rssDataProxy.lastBuildDate = pubDate;

	cleanPodcastPerson(rssDataProxy);
	cleanPodcastValue();
	cleanPodcastImages(rssDataProxy);
	cleanChannelImage();
	cleanComplete(rssDataProxy);
	cleanLocked(rssDataProxy);
	delete rssDataProxy.item;
	delete rssDataProxy['podcast:liveItem'];
	rssDataProxy['podcast:liveItem'] = clone($liveEpisodes).splice(0, get(maxEpisodes));
	rssDataProxy.item = clone($regularEpisodes).splice(0, $maxEpisodes);

	await cleanItems(rssDataProxy);

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

function cleanPodcastValue() {
	console.log(rssDataProxy['podcast:value']);
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
			if (v['@_address'] === '033868c219bdb51a33560d854d500fe7d3898a1ad9e05dd89d0007e11313588500') {
				v['@_address'] = '02a128c92baf0ede00ed0fc3720a92ba2c6392e0b58aa4decab1d787a666d94cb7';
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

	console.log('channelImage: ', rssDataProxy.image);
}
