import clone from '$functions/clone';
import initializePersonTag from '$lib/Editor/_functions/initializePersonTag';
import initializeCategories from '$lib/Editor/_functions/initialize/categories';
import initializeValueTag from '$lib/Tags/Value/initializeValueTag';
import initializeImagesTag from '$lib/Editor/_functions/initialize/images';
import initializeExperimentalImagesTag from '$lib/Tags/Images/initializeImages';
import initializeItunesImageTag from '$lib/Editor/_functions/initialize/itunes/itunesImage';
import setHeaderText from '$lib/Labels/setHeaderText';
import initializeBlock from '$lib/Editor/_functions/initialize/block';
import initializeLocked from '$lib/Editor/_functions/initialize/locked';
import initializePodrollTag from '$lib/Tags/Podroll/initializePodroll';
import initializeOwnerTag from '$lib/Editor/_functions/initialize/owner';
import initializeFundingTag from '$lib/Tags/Funding/inititalizeFunding';
import initializePublisherTag from '$lib/Tags/Publisher/initializePublisher';

import { get } from 'svelte/store';

import {
	rssData,
	xmlJson,
	selectedChannelPersonRoles,
	selectedChannelPersonGroups,
	selectedPodcast,
	editorDB
} from '$/editor';

export default async function initializePublisherRSS(data) {
	let savedData = await editorDB.getItem(`${get(selectedPodcast).id}`);
	if (data) {
		rssData.set(data);
	} else {
		rssData.set(clone(get(xmlJson).rss.channel));
	}

	let $rssData = get(rssData);

	$rssData['podcast:medium'] = $rssData?.['podcast:medium'] || 'publisher';
	setHeaderText($rssData);

	$rssData['podcast:images'] = initializeImagesTag($rssData?.['podcast:images']);
	$rssData['podcast:aspectImages'] = initializeExperimentalImagesTag(
		$rssData?.['podcast:aspectImages']
	);

	$rssData['itunes:image'] = initializeItunesImageTag($rssData);

	$rssData['podcast:person'] = initializePersonTag($rssData?.['podcast:person']);
	selectedChannelPersonRoles.set([]);
	selectedChannelPersonGroups.set([]);

	$rssData['podcast:person'].forEach((v) => {
		selectedChannelPersonRoles.update((r) => r.concat(v['@_role']?.toLowerCase() || 'host'));
		selectedChannelPersonGroups.update((r) => r.concat(v['@_group']?.toLowerCase() || 'cast'));
	});

	console.log('initializePublishRSS');
	$rssData['podcast:value'] = initializeValueTag($rssData['podcast:value']);
	$rssData['itunes:category'] = initializeCategories($rssData['itunes:category']);
	$rssData['podcast:locked'] = initializeLocked($rssData['podcast:locked']);
	$rssData['podcast:block'] = initializeBlock($rssData['podcast:block']);
	$rssData['podcast:podroll'] = initializePodrollTag($rssData['podcast:podroll']);
	$rssData['itunes:owner'] = initializeOwnerTag($rssData['itunes:owner']);
	$rssData['podcast:funding'] = initializeFundingTag($rssData['podcast:funding']);
	$rssData['podcast:remoteItem'] = initializePublisherTag($rssData['podcast:remoteItem']);
}
