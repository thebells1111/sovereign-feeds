import { v4 as uuidv4 } from 'uuid';
import cleanPodcastImages from './images';
import cleanEpisodePerson from './episodePerson';
import cleanPodcastSocialInteract from './socialInteract';
import cleanLicense from './license';
import cleanChat from '$lib/Editor/Tags/Chat/cleanChat';
import cleanLiveValue from '$lib/Editor/Tags/LiveValue/cleanLiveValue';
import cleanValueTimeSplit from '$lib/Editor/Tags/ValueSplits/cleanValueTimeSplit';
import cleanAlternateEnclosure from './alternateEnclosure';
import { get } from 'svelte/store';

import { selectedPodcast, trackerDB } from '$/editor';

let alerted = false;
let confirmed = false;
let trackers;

export default async function cleanItems(data) {
	trackers = (await trackerDB.getItem(`${get(selectedPodcast).url}`)) || { active: [] };

	if (data.item) {
		for (let item of data.item) {
			await cleanItem(item, data);
		}
	}

	if (data['podcast:liveItem']) {
		data['podcast:liveItem'] = data['podcast:liveItem'].filter((v) => {
			return v?.enclosure?.['@_url'];
		});
		if (data['podcast:liveItem'].length > 0) {
			for (let item of data['podcast:liveItem']) {
				console.log('liveItem: ', item);
				await cleanItem(item);
				await cleanLiveItem(item);

				//add cleaners for liveItem
			}
		} else {
			delete data['podcast:liveItem'];
		}
	}
	alerted = false;
	confirmed = false;
}

async function cleanItem(item, data) {
	delete item.sfID;

	// handleTrackers(item);
	cleanPodcastSocialInteract(item);
	cleanEpisodePerson(item);
	cleanEpisodeValue(item, data);
	cleanEpisodeTranscript(item);
	cleanPodcastImages(item);
	cleanLicense(item);
	cleanChat(item);
	cleanLiveValue(item);
	cleanAlternateEnclosure(item);

	if (!item.guid?.['#text']) {
		item.guid = { '#text': uuidv4(), '@_isPermaLink': false };
	}

	if (!item.author) {
		delete item.author;
	}

	if (!item['@_status']) {
		if (!item.enclosure['@_length']) {
			await getEnclosureLength(item);
		}
		if (!item['itunes:duration']) {
			if (!alerted) {
				alerted = true;
				let text = `Your episodes don't have a duration. This is not strictly necessary, but is nice because it allows an app to display how long your episode is. Depending on how many episode you have, this may take awhile. You can monitor your progress by pressing F12. Would you like to add a duration to your episodes?`;
				if (confirm(text) == true) {
					confirmed = true;
				}
			}
			if (confirmed) {
				if (!item['itunes:duration']) {
					await getDuration(item);
				}
			}
		} else {
			item['itunes:duration'] = Math.round(item['itunes:duration']);
		}
	} else {
		item.enclosure['@_length'] = 33;
		delete item.duration;
		delete item['itunes:duration'];
	}

	if (!item['itunes:image']?.['@_href']) {
		delete item['itunes:image'];
	}

	if (!item['itunes:keywords']) {
		delete item['itunes:keywords'];
	}

	if (!item.link) {
		delete item.link;
	}

	let hadBoostagrams;

	if (item?.['podcast:chapters']?.boostagrams) {
		hadBoostagrams = true;
	}

	if (item?.['podcast:chapters'] && !item?.['podcast:chapters']?.['@_type']) {
		item['podcast:chapters']['@_type'] = 'application/json';
	}

	if (item?.['podcast:chapters']?.boostagrams) {
		let chapterUrl =
			'https://reflex.livewire.io/chapters/podcast/' +
			get(selectedPodcast)['podcastGuid'] +
			'/item/' +
			item.guid['#text'];
		if (item?.['podcast:chapters']?.['@_url']) {
			chapterUrl += '/chapters/' + item?.['podcast:chapters']?.['@_url'];
		}

		item['podcast:chapters']['@_url'] = chapterUrl;
	}

	if (!item?.['podcast:chapters']?.['@_url']) {
		delete item['podcast:chapters'];
	} else {
		delete item['podcast:chapters'].boostagrams;
	}

	cleanValueTimeSplit(item);
}

async function handleTrackers(item) {
	if (trackers?.active?.length) {
		let url = item?.enclosure?.['@_url'];
		if (url.indexOf('http://') == 0) {
			url = url.substring(7);
		}

		if (url.indexOf('https://') == 0) {
			url = url.substring(8);
		}

		let prefix = '';
		let specialPrefix = '';

		trackers.active.forEach((v) => {
			url = url.split(v).join('');
			if (v.slice(-1) !== '/') {
				v = v + '/';
			}
			// If the string is 'ipfspodcasting.net/e', it goes in specialPrefix, else in prefix
			if (v === 'ipfspodcasting.net/e/') {
				specialPrefix = v;
			} else {
				prefix = prefix + v;
			}
		});

		// Add specialPrefix to the end
		prefix = prefix + specialPrefix;

		url = 'https://' + prefix + url;
		item.enclosure['@_url'] = url;
	}
}

async function cleanLiveItem(item) {
	if (!item?.['podcast:contentLink']?.['@_href']) {
		delete item['podcast:contentLink'];
	}

	delete item['@_liveValueLink'];

	if (!item['@_chat']) {
		delete item['@_chat'];
	}

	if (!item['@_end']) {
		delete item['@_end'];
	}

	processLiveItemTimes(item);

	if (
		!(item['@_status'] === 'live' || item['@_status'] === 'pending' || item['@_status'] === 'ended')
	) {
		item['@_status'] = 'pending';
	}

	delete item?.['podcast:value']?.['podcast:valueTimeSplit'];
	delete item.valueTimeSplit;
}

function processLiveItemTimes(item) {
	let start = { ...item['@_start'] };
	if (!start.dateTime) {
		return item;
	}
	let d = new Date(start.dateTime);
	d.setSeconds(0);
	d.setMilliseconds(0);

	let h = start.meridian ? start.hour + 12 : start.hour;
	h = h === 12 ? 0 : h;
	h = h === 24 ? 12 : h;
	d.setHours(h);
	d.setMinutes(start.minute);
	d.setSeconds(0);
	d.setMilliseconds(0);
	let t = d.getTime();
	item['@_start'] = d.toISOString();
	let addTime = Number(start.duration.hour) * 3600000 + Number(start.duration.minute) * 60000;

	item['@_end'] = new Date(t + addTime).toISOString();
}

function cleanEpisodeValue(item, data) {
	if (item?.['podcast:value']) {
		if (item?.['podcast:value']?.['podcast:valueRecipient']) {
			item['podcast:value']['podcast:valueRecipient'] = [].concat(
				item['podcast:value']['podcast:valueRecipient']
			);
		} else if (item['podcast:value']?.['podcast:valueTimeSplit']) {
			item['podcast:value']['@_method'] = data['podcast:value']['@_method'];
			item['podcast:value']['@_suggested'] = data['podcast:value']['@_suggested'];
			item['podcast:value']['@_type'] = data['podcast:value']['@_type'];
			item['podcast:value']['podcast:valueRecipient'] = [].concat(
				data['podcast:value']['podcast:valueRecipient']
			);
		}

		item['podcast:value']['podcast:valueRecipient'] = item['podcast:value'][
			'podcast:valueRecipient'
		].filter((v) => {
			if (!v?.['@_name']) {
				delete v['@_name'];
			}
			if (!v?.['@_customKey']) {
				delete v['@_customKey'];
			}
			if (!v?.['@_customValue']) {
				delete v['@_customValue'];
			}
			if (!v?.['@_fee']) {
				delete v['@_fee'];
			}
			if (!v?.['@_address'] || !v['@_split']) {
				return false;
			}
			if (v?.['@_name'] === 'Sovereign Feeds') {
				v['@_address'] = '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3';
				v['@_customKey'] = '696969';
				v['@_customValue'] = 'eChoVKtO1KujpAA5HCoB';
			}
			return v;
		});
		if (
			(!item?.['podcast:value']?.['podcast:valueRecipient']?.[0]?.['@_address'] ||
				!item?.['podcast:value']?.['podcast:valueRecipient']?.[0]?.['@_split']) &&
			!item['podcast:value']?.['podcast:valueTimeSplit']
		) {
			delete item['podcast:value'];
		}
	}
}

function cleanEpisodeTranscript(item) {
	if (item['podcast:transcript']) {
		item['podcast:transcript'] = [].concat(item['podcast:transcript']).filter((v) => {
			if (!v['@_type'] || !v['@_url']) {
				return false;
			}
			if (!v['@_language']) {
				delete v['@_language'];
			}
			if (!v['@_rel']) {
				delete v['@_rel'];
			}

			return v;
		});
		if (!item['podcast:transcript']?.length) {
			delete item['podcast:transcript'];
		}
	}
}

async function getDuration(item) {
	console.log(item);
	if (item?.enclosure?.['@_url']) {
		return new Promise((resolve, reject) => {
			// Create a non-dom allocated Audio element
			let a = document.createElement('audio');

			// Define the URL of the MP3 audio file
			a.src = item?.enclosure?.['@_url'];

			a.addEventListener('error', function failed(e) {
				a.remove();
				delete item['itunes:duration'];
				resolve();
			});

			// Once the metadata has been loaded, display the duration in the console
			a.addEventListener(
				'loadedmetadata',
				function () {
					console.log(a);
					console.log(a.duration);
					let duration = a.duration;
					item['itunes:duration'] = Math.round(duration);
					console.log(item['itunes:duration']);

					a.remove();
					resolve();
				},
				false
			);
		});
	} else {
		return new Promise((resolve, reject) => {
			delete item['itunes:duration'];
			resolve();
		});
	}
}

async function getEnclosureLength(item) {
	if (item?.enclosure?.['@_url']) {
		try {
			let size = '';

			const response = await fetch(item?.enclosure?.['@_url'], {
				method: 'HEAD'
			});
			if (!response.ok) {
				throw Error(`${response.status} ${response.statusText}`);
			}
			size = response.headers.get('content-length');

			item.enclosure['@_length'] = size;
		} catch (error) {
			console.log(error);
			item.enclosure['@_length'] = 0;
		}
	} else {
		delete item.enclosure;
	}
}
