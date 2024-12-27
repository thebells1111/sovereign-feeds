import { v4 as uuidv4 } from 'uuid';
import cleanPodcastImages from './images';
import cleanExperimentalImages from '$lib/Tags/Images/cleanImages';
import cleanEpisodePerson from './episodePerson';
import cleanPodcastSocialInteract from './socialInteract';
import cleanLicense from './license';
import cleanChat from '$lib/Tags/Chat/cleanChat';
import cleanLiveValue from '$lib/Tags/LiveValue/cleanLiveValue';
import cleanValueTimeSplit from '$lib/Tags/ValueSplits/cleanValueTimeSplit';
import cleanAlternateEnclosure from './alternateEnclosure';
import cleanFunding from '$lib/Tags/Funding/cleanFunding';
import cleanValue from '$lib/Tags/Value/cleanValue';
import { get } from 'svelte/store';

import { selectedPodcast, trackerDB } from '$/editor';

let alerted = false;
let confirmed = false;
let trackers;

export default async function cleanItems(channel) {
	trackers = (await trackerDB.getItem(`${get(selectedPodcast).url}`)) || { active: [] };

	if (channel.item) {
		for (let item of channel.item) {
			await cleanItem(item, channel);
		}
	}

	if (channel['podcast:liveItem']) {
		channel['podcast:liveItem'] = channel['podcast:liveItem'].filter((v) => {
			return v?.enclosure?.['@_url'];
		});
		if (channel['podcast:liveItem'].length > 0) {
			for (let item of channel['podcast:liveItem']) {
				await cleanItem(item, channel);
				await cleanLiveItem(item, channel);

				//add cleaners for liveItem
			}
		} else {
			delete channel['podcast:liveItem'];
		}
	}
	alerted = false;
	confirmed = false;
}

async function cleanItem(item, channel) {
	if (channel?.['podcast:guid'] === '917393e3-1b1e-5cef-ace4-edaa54e1f810') {
		item['podcast:splitbox'] = {
			'@_invoice': 'https://thesplitbox.com/invoice?address=thesplitbox@getalby.com',
			'@_webhook': 'https://thesplitbox.com/webhook?address=thesplitbox@getalby.com'
		};
	}
	delete item.sfID;

	// handleTrackers(item);
	cleanPodcastSocialInteract(item);
	cleanEpisodePerson(item);
	cleanValueTimeSplit(item, channel);
	cleanValue(item);
	cleanEpisodeTranscript(item);
	cleanPodcastImages(item);
	cleanExperimentalImages(item);
	cleanLicense(item);
	cleanChat(item);
	cleanLiveValue(item);
	cleanAlternateEnclosure(item);
	cleanFunding(item);

	if (!item.guid?.['#text']) {
		item.guid = { '#text': uuidv4(), '@_isPermaLink': false };
	}

	if (!item.author) {
		delete item.author;
	}

	//status is used for live items, so this filters out live items
	if (!item['@_status']) {
		if (item?.enclosure?.['@_url'] && !item?.enclosure?.['@_length']) {
			await getEnclosureLength(item);
			if (!item?.enclosure?.['@_length']) {
				item.enclosure['@_length'] = 33;
			}
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
					try {
						await getDuration(item);
					} catch (e) {
						console.log(e);
					}
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
	if (item?.enclosure?.['@_url']) {
		return new Promise((resolve) => {
			// Create a non-dom allocated Audio element
			const a = document.createElement('audio');

			// Define the URL of the MP3 audio file
			a.src = item.enclosure['@_url'];

			// Set a timeout to handle unresponsive audio element
			const timeout = setTimeout(() => {
				a.remove();
				item['itunes:duration'] = 0;
				alert('Not able to fetch your duration. Usually a CORS issue with your files.');
				resolve(); // Resolve without setting duration
			}, 5000); // Adjust timeout as needed (e.g., 5000ms = 5 seconds)

			a.addEventListener('error', () => {
				clearTimeout(timeout);
				a.remove();
				item['itunes:duration'] = 0;
				alert('Not able to fetch your duration. Usually a CORS issue with your files.');
				resolve();
			});

			// Once the metadata has been loaded, calculate and set the duration
			a.addEventListener('loadedmetadata', () => {
				clearTimeout(timeout);
				const duration = a.duration;
				item['itunes:duration'] = Math.round(duration);
				a.remove();
				resolve();
			});
		});
	} else {
		// No URL provided, simply resolve
		return Promise.resolve(() => {
			item['itunes:duration'] = 0;
			alert('Not able to fetch your duration. Usually a CORS issue with your files.');
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
