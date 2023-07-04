import clone from '$functions/clone';
import initializePersonTag from './initializePersonTag';
import initializeValueTag from './initializeValueTag';
import initializeSocialInteractTag from './initialize/socialInteract';
import initializeTranscriptTag from './initialize/transcript';
import initializeImagesTag from './initialize/images';
import initializeItunesImageTag from '$lib/Editor/_functions/initialize/itunes/itunesImage';
import initializeContentLink from './initialize/contentLink';
import initializeLiveTime from './initialize/liveItemTime';
import initializeEpisodeGuid from './initialize/episodeGuid';
import initializeLicenseTag from './initialize/license';
import initializeValueTimeSplit from './initialize/valueTimeSplit';
import initializeChat from '$lib/Editor/Tags/Chat/initializeChat';
import initializeLiveValue from '$lib/Editor/Tags/LiveValue/initializeLiveValue';

import { selectedEpisodePersonRoles, selectedEpisodePersonGroups } from '$/editor';

export default async function initializeEpisode(episode, type) {
	episode['itunes:image'] = initializeItunesImageTag(episode);
	episode['podcast:person'] = initializePersonTag(episode?.['podcast:person']);
	episode['podcast:socialInteract'] = initializeSocialInteractTag(
		episode?.['podcast:socialInteract']
	);
	episode['podcast:transcript'] = initializeTranscriptTag(episode?.['podcast:transcript']);
	episode['podcast:chapters'] = episode['podcast:chapters'] || { '@_url': '' };

	episode['podcast:images'] = initializeImagesTag(episode?.['podcast:images'], 'episode');
	if (!episode.valueTimeSplit) {
		episode.valueTimeSplit = await initializeValueTimeSplit(episode);
	}
	selectedEpisodePersonRoles.set([]);
	selectedEpisodePersonGroups.set([]);
	episode.guid = initializeEpisodeGuid(episode);

	episode['podcast:person'].forEach((v) => {
		selectedEpisodePersonRoles.update((r) => r.concat(v['@_role']?.toLowerCase() || 'host'));
		selectedEpisodePersonGroups.update((r) => r.concat(v['@_group']?.toLowerCase() || 'cast'));
	});

	episode['podcast:value'] = initializeValueTag(episode['podcast:value']);
	episode['podcast:license'] = initializeLicenseTag(episode['podcast:license']);
	episode['podcast:chat'] = initializeChat(episode['podcast:chat']);

	if (type === 'live') {
		episode['podcast:contentLink'] = initializeContentLink(episode['podcast:contentLink']);
		episode['@_status'] = episode['@_status'] || 'pending';
		episode['@_status'] = episode['@_status'].toLowerCase();
		episode['@_start'] = initializeLiveTime(episode);
		episode['podcast:liveValue'] = initializeLiveValue(episode['podcast:liveValue']);
		console.log(episode);

		if (episode['@_liveValueLink']) {
			console.log(episode['@_liveValueLink']);
			episode['podcast:liveValue']['@_uri'] = episode['@_liveValueLink'];
			delete episode['@_liveValueLink'];
		}
	}
	console.log(episode);
}
