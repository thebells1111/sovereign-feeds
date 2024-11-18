import clone from '$functions/clone';
import initializePersonTag from '$lib/Editor/_functions/initializePersonTag';
import initializeValueTag from '$lib/Editor/_functions/initializeValueTag';
import initializeImagesTag from '$lib/Editor/_functions/initialize/images';
import initializeExperimentalImagesTag from '$lib/Tags/Images/initializeImages';
import initializeEpisode from '$lib/Editor/_functions/initializeEpisode';
import initializeItunesImageTag from '$lib/Editor/_functions/initialize/itunes/itunesImage';
import blankLiveItem from '$lib/Editor/_functions/blanks/liveItem';
import setHeaderText from '$lib/Labels/setHeaderText';
import initializeCategories from '$lib/Editor/_functions/initialize/categories';
import initializeComplete from '$lib/Editor/_functions/initialize/complete';
import initializeLocked from '$lib/Editor/_functions/initialize/locked';
import initializeBlock from '$lib/Editor/_functions/initialize/block';
import initializeLicenseTag from '$lib/Editor/_functions/initialize/license';
import initializePodrollTag from '$lib/Tags/Podroll/initializePodroll';
import initializeOwnerTag from '$lib/Editor/_functions/initialize/owner';
import initializeFundingTag from '$lib/Tags/Funding/inititalizeFunding';

import { get } from 'svelte/store';

import {
	rssData,
	xmlJson,
	episodesList,
	filteredEpisodesList,
	editingEpisode,
	selectedChannelPersonRoles,
	selectedChannelPersonGroups,
	selectedPodcast,
	maxEpisodes,
	editorDB,
	liveEpisodes,
	regularEpisodes,
	currentPage
} from '$/editor';

const uid = () =>
	String(
		Date.now().toString(32) +
			(Math.random() * Math.random() * Math.random() * Math.random()).toString(16)
	).replace(/\./g, '');

function durationToSeconds(input) {
	try {
		// If the input is a number, simply return it after rounding.
		if (typeof input === 'number') {
			return Math.round(input);
		}

		// If the input is a string, check its format and convert to seconds accordingly.
		if (typeof input === 'string') {
			if (input.includes(':')) {
				// If it includes a colon, split into parts and convert to seconds.
				let parts = input.split(':');
				let seconds = 0;
				switch (parts.length) {
					case 3: // 'hh:mm:ss' format
						seconds += parseInt(parts[0], 10) * 3600; // hours to seconds
						seconds += parseInt(parts[1], 10) * 60; // minutes to seconds
						seconds += parseFloat(parts[2]); // just seconds, could be a float
						break;
					case 2: // 'mm:ss' format
						seconds += parseInt(parts[0], 10) * 60; // minutes to seconds
						seconds += parseFloat(parts[1]); // just seconds, could be a float
						break;
				}
				return Math.round(seconds);
			} else {
				// If it doesn't include a colon, parse it as a single number of seconds.
				return Math.round(parseFloat(input));
			}
		}

		// If the input is neither a number nor a string, return 0.
		return 0;
	} catch (error) {
		// If any error occurs, return 0.
		return 0;
	}
}

export default async function initializeRSSData(data) {
	console.log(clone(data));
	//this is used to store things like max episodes
	console.log(get(selectedPodcast));
	let savedData = await editorDB.getItem(`${get(selectedPodcast).id}`);

	if (data) {
		rssData.set(data);
	} else {
		rssData.set(clone(get(xmlJson).rss.channel));
	}
	let $rssData = get(rssData);
	if ($rssData['podcast:medium'] === 'musicL') {
		currentPage.set('podcastMetadata');
	}
	if ($rssData.item) {
		$rssData.item = [].concat($rssData.item);
		regularEpisodes.set(
			$rssData.item.map((v) => {
				v.sfID = uid();
				if (v['itunes:duration']) {
					v['itunes:duration'] = durationToSeconds(v['itunes:duration']);
				}
				return v;
			})
		);
	}
	if ($rssData['podcast:liveItem']) {
		$rssData['podcast:liveItem'] = [].concat($rssData['podcast:liveItem']);
	} else {
		$rssData['podcast:liveItem'] = [clone(blankLiveItem)];
	}
	liveEpisodes.set(
		$rssData['podcast:liveItem'].map((v) => {
			v.sfID = uid();
			return v;
		})
	);
	let episodes = get(regularEpisodes);
	let maxEps = savedData?.maxEpisodes || 1000;
	episodesList.set(episodes);
	filteredEpisodesList.set(clone(episodes).slice(0, maxEps));
	if ($rssData.item) {
		editingEpisode.set($rssData.item[0] || $rssData.item);
		maxEpisodes.set(maxEps);
	}
	$rssData['podcast:medium'] = $rssData['podcast:medium'] || 'podcast';
	setHeaderText($rssData);

	$rssData['podcast:images'] = initializeImagesTag($rssData?.['podcast:images']);
	$rssData['podcast:aspectImages'] = initializeExperimentalImagesTag(
		$rssData?.['podcast:aspectImages']
	);

	$rssData['itunes:image'] = initializeItunesImageTag($rssData);

	//Initialize Person
	//Podcast
	$rssData['podcast:person'] = initializePersonTag($rssData?.['podcast:person']);
	selectedChannelPersonRoles.set([]);
	selectedChannelPersonGroups.set([]);

	$rssData['podcast:person'].forEach((v) => {
		selectedChannelPersonRoles.update((r) => r.concat(v['@_role']?.toLowerCase() || 'host'));
		selectedChannelPersonGroups.update((r) => r.concat(v['@_group']?.toLowerCase() || 'cast'));
	});

	$rssData['podcast:value'] = initializeValueTag($rssData['podcast:value']);
	$rssData['itunes:category'] = initializeCategories($rssData['itunes:category']);
	$rssData['podcast:complete'] = initializeComplete($rssData['podcast:complete']);
	$rssData['podcast:locked'] = initializeLocked($rssData['podcast:locked']);
	$rssData['podcast:block'] = initializeBlock($rssData['podcast:block']);
	$rssData['podcast:license'] = initializeLicenseTag($rssData['podcast:license']);
	$rssData['podcast:podroll'] = initializePodrollTag($rssData['podcast:podroll']);
	$rssData['itunes:owner'] = initializeOwnerTag($rssData['itunes:owner']);
	$rssData['podcast:funding'] = initializeFundingTag($rssData['podcast:funding']);

	let $editingEpisode = get(editingEpisode);

	//Episode
	if ($rssData.item) {
		initializeEpisode($editingEpisode);
	}
}
