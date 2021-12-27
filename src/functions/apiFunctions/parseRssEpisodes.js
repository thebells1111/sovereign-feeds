import { parse } from 'fast-xml-parser';
import { decode } from 'html-entities';
// import fetch from 'node-fetch';

export async function getEpisodesFromURL(data) {
	try {
		const res = await fetch(data.feedUrl, {
			headers: { 'User-Agent': 'CurioCaster/0.1' }
		});
		const feed = await res.text();
		if (!feed.includes('<rss')) throw new Error('Not XML');

		var parserOptions = {
			ignoreAttributes: false,
			attributeNamePrefix: '',
			trimValues: true,
			allowBooleanAttributes: true,
			attrValueProcessor: (val, attrName) => decode(val, { isAttributeValue: true }), //default is a=>a
			tagValueProcessor: (val, tagName) => decode(val) //default is a=>a
		};

		let rss = parse(feed, parserOptions).rss;

		let channel = rss.channel;

		let items = [].concat(channel.item);

		episodes = [];

		for (const item of items) {
			if (typeof item.enclosure != 'undefined') {
				let episode = {};
				episode.alternateEnclosure = item['podcast:alternateEnclosure'] || null;
				episode.author = item.author || item['itunes:author'] || null;
				episode.chaptersUrl = (item['podcast:chapters'] && item['podcast:chapters'].url) || null;
				episode.dateCrawled = new Date().getTime();
				episode.datePublished = new Date(item.pubDate).getTime() / 1000;
				episode.datePublishedPretty = prettyFormatDate(item.pubDate);
				episode.description = item.description || '';
				episode.duration = Math.round(item['itunes:duration']) || 0;
				episode.enclosureLength = item.enclosure.length || 0;
				episode.enclosureType = item.enclosure.type || null;
				episode.enclosureUrl = item.enclosure.url || null;
				episode.episode = item['podcast:episode'] || null;
				episode.episodeType = item['itunes:episodeType'] || null;
				episode.explicit = item['itunes:explicit'] || '';
				episode.feedId = null;
				episode.feedImage = (item['itunes:image'] && item['itunes:image'].href) || null;
				episode.feedItunesId = item['itunes:id'] || null;
				episode.feedLanguage = item.language || null;
				episode.guid = (item.guid && item.guid[`#text`]) || null;
				episode.guidPermaLink = (item.guid && item.guid.isPermaLink) || null;
				episode.id = item['podcast:id'] || null;
				episode.image = episode.feedImage;
				episode.keywords = item['itunes:keywords'];
				episode.link = item.link || null;
				episode.location = item['podcast:location'] || null;
				episode.person = item['podcast:person'] || null;
				episode.podcastPerson = channel['podcast:person'] || null;
				episode.season = item['podcast:season'] || 0;
				episode.title = item.title;
				episode.transcript = item['podcast:transcript']
					? [].concat(item['podcast:transcript'])
					: null;

				episode.value = null;
				if (item['podcast:value']) {
					let value = {};
					value.destinations = [].concat(item['podcast:value']['podcast:valueRecipient']);
					delete item['podcast:value']['podcast:valueRecipient'];
					value.model = item['podcast:value'];
					episode.value = value;
				}

				episodes.push(episode);
			}
		}

		if (episodes.length > 0) {
			let r = {
				artwork: channel['itunes:image'] && channel['itunes:image'].href,
				episodes: episodes
			};

			if (data.editor) {
				r.channel = channel;
			}
			return r;
		}
		return;
	} catch (err) {
		throw err;
	}
}

function prettyFormatDate(date) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let d = new Date(date);
	const year = d.getFullYear();
	const day = d.getDate();
	const monthName = months[d.getMonth()];
	const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	return `${monthName} ${day < 10 ? `0${day}` : day}, ${year} ${time}`;
}
