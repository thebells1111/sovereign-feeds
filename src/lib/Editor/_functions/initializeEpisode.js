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

import { selectedEpisodePersonRoles, selectedEpisodePersonGroups, valueAudioItem } from '$/editor';

export default async function initializeEpisode(episode, type) {
	console.log(episode);
	episode['itunes:image'] = initializeItunesImageTag(episode);
	episode['podcast:person'] = initializePersonTag(episode?.['podcast:person']);
	episode['podcast:socialInteract'] = initializeSocialInteractTag(
		episode?.['podcast:socialInteract']
	);
	episode['podcast:transcript'] = initializeTranscriptTag(episode?.['podcast:transcript']);
	episode['podcast:chapters'] = episode['podcast:chapters'] || { '@_url': '' };

	episode['podcast:images'] = initializeImagesTag(episode?.['podcast:images'], 'episode');
	episode.valueAudioItem = await initializeValueTimeSplit(episode);
	valueAudioItem.set(episode.valueAudioItem);
	selectedEpisodePersonRoles.set([]);
	selectedEpisodePersonGroups.set([]);
	episode.guid = initializeEpisodeGuid(episode);

	episode['podcast:person'].forEach((v) => {
		selectedEpisodePersonRoles.update((r) => r.concat(v['@_role']?.toLowerCase() || 'host'));
		selectedEpisodePersonGroups.update((r) => r.concat(v['@_group']?.toLowerCase() || 'cast'));
	});

	episode['podcast:value'] = initializeValueTag(episode['podcast:value']);
	episode['podcast:license'] = initializeLicenseTag(episode['podcast:license']);

	if (type === 'live') {
		episode['podcast:contentLink'] = initializeContentLink(episode['podcast:contentLink']);
		episode['@_status'] = episode['@_status'] || 'pending';
		episode['@_status'] = episode['@_status'].toLowerCase();
		episode['@_start'] = initializeLiveTime(episode);
	}
	console.log(episode);
}
