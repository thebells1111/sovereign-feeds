import { writable } from 'svelte/store';
import { browser, dev } from '$app/environment';
import podcastSelectorList from '$lib/Labels/SideSelector/podcast';
import tagHeadersList from '$lib/Labels/TagHeaderList/podcast';
import newEpisodeHeadersList from '$lib/Labels/NewEpisodeHeaders/podcast';

const mode = dev ? 'dev' : 'prod';

export const editorDB =
	browser &&
	localforage.createInstance({
		name: 'editorDB'
	});

export const chaptersDB =
	browser &&
	localforage.createInstance({
		name: 'chaptersDB'
	});

export const trackerDB =
	browser &&
	localforage.createInstance({
		name: 'trackerDB'
	});

let remoteServerUrls = {
	dev: 'http://localhost:8000',
	prod: 'https://curiohoster.com'
};

let socketUrls = {
	dev: 'http://localhost:8000',
	prod: 'https://curiohoster.com'
};

export const remoteServerUrl = remoteServerUrls[mode];
export const socketUrl = socketUrls[mode];
export const proxy = remoteServerUrl + `/api/proxy?url=`;

export const xmlJson = writable(null);
export const selectedChannelPersonGroups = writable([]);
export const selectedChannelPersonRoles = writable([]);
export const selectedEpisodePersonGroups = writable([]);
export const selectedEpisodePersonRoles = writable([]);
export const blankPerson = {
	'#text': '',
	'@_href': '',
	'@_img': '',
	'@_group': 'cast',
	'@_role': 'host'
};

export const rssData = writable(null);
export const editingEpisode = writable(null);
export const editingIndex = writable(0);
export const selectedEpisode = writable(null);
export const baseValue = writable(null);

export const podcastList = writable([]);
export const selectedPodcast = writable({});
export const podcastSearchResults = writable({});
export const episodesList = writable([]);
export const filteredEpisodesList = writable([]);
export const rightPane = writable('episodeMetadata');
export const showNotesPane = writable(null);
export const maxEpisodes = writable(1000);
export const loadImageTags = writable(() => {});
export const validatedFeeds = writable(new Set());
export const user = writable({});
export const showLiveEpisodes = writable(false);
export const liveEpisodes = writable([]);
export const regularEpisodes = writable([]);
export const newEditorScreen = writable('podcast');
export const duplicateEditorScreen = writable('episodeMeta');
export const showNewEditor = writable(false);
export const socialInteractProtocolOptions = writable([
	'disabled',
	'activitypub',
	'twitter',
	'lightning'
]);
export const selectorList = writable(podcastSelectorList);
export const tagHeaders = writable(tagHeadersList);
export const newEpisodeHeaders = writable(newEpisodeHeadersList);

export const showSaved = writable(false);
export const showServerSending = writable(false);
export const showServerSendingErrorMsg = writable('');
export const podpingMessage = writable('');
export const showBuildingRSS = writable(false);
export const expandPodcastList = writable(true);
export const webhookLink = writable('');
export const webhookSecret = writable('');

export const currentPage = writable('feeds');
export const digitalOceanEnabled = writable(false);

export const licenses = writable({});
export const feedText = writable('');
export const rssEditor = writable(true);

export const valueAlbumList = writable([]);
export const valueAudioItem = writable([]);
export const copiedValueAudioItem = writable();
export const editingAudioItem = writable();
