import clone from '$functions/clone';
import initializePersonTag from './initializePersonTag';
import initializeValueTag from './initializeValueTag';
import initializeImagesTag from './initialize/images';
import initializeEpisode from './initializeEpisode';
import initializeItunesImageTag from './initialize/itunes/itunesImage';
import blankLiveItem from './blanks/liveItem';
import setHeaderText from './setHeaderText';
import initializeCategories from './initialize/categories';
import initializeComplete from './initialize/complete';
import initializeLocked from './initialize/locked';
import initializeBlock from './initialize/block';

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
	regularEpisodes
} from '$/editor';

const uid = () =>
	String(
		Date.now().toString(32) +
			(Math.random() * Math.random() * Math.random() * Math.random()).toString(16)
	).replace(/\./g, '');

export default async function initializeRSSData(data) {
	//this is used to store things like max episodes
	console.log(get(selectedPodcast));
	let savedData = await editorDB.getItem(`${get(selectedPodcast).id}`);

	if (data) {
		rssData.set(data);
	} else {
		rssData.set(clone(get(xmlJson).rss.channel));
	}
	let $rssData = get(rssData);
	$rssData.item = [].concat($rssData.item);
	regularEpisodes.set(
		$rssData.item.map((v) => {
			v.sfID = uid();
			return v;
		})
	);
	if ($rssData['podcast:liveItem']) {
		$rssData['podcast:liveItem'] = [].concat($rssData['podcast:liveItem']);
	} else {
		$rssData['podcast:liveItem'] = [clone(blankLiveItem)];
	}
	liveEpisodes.set(
		clone(
			$rssData['podcast:liveItem'].map((v) => {
				v.sfID = uid();
				return v;
			})
		)
	);
	let episodes = get(regularEpisodes);
	let maxEps = savedData?.maxEpisodes || 1000;
	episodesList.set(episodes);
	filteredEpisodesList.set(clone(episodes).slice(0, maxEps));
	editingEpisode.set($rssData.item[0] || $rssData.item);
	maxEpisodes.set(maxEps);
	$rssData['podcast:medium'] = $rssData['podcast:medium'] || 'podcast';
	setHeaderText($rssData);

	$rssData['podcast:guid'] = get(selectedPodcast).podcastGuid;

	$rssData['podcast:images'] = initializeImagesTag($rssData?.['podcast:images']);

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

	let $editingEpisode = get(editingEpisode);

	//Episode
	initializeEpisode($editingEpisode);
}
