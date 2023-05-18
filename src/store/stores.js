import { writable } from 'svelte/store';
import { browser, dev } from '$app/env';

export let devMode = false;
export let useSentry = false;

const server = 'test';

let serverUrls = {
	dev: 'http://127.0.0.1:8000/api/',
	test: '/api/',
	prod: 'https://curiohoster.com/api/'
};

export const serverUrl = serverUrls[server];

export const windowHeight = writable(null);

//databases
export const userStateDB =
	browser &&
	localforage.createInstance({
		name: 'userStateDB'
	});
export const podcastStateDB =
	browser &&
	localforage.createInstance({
		name: 'podcastStateDB'
	});
export const podcastDB =
	browser &&
	localforage.createInstance({
		name: 'podcastDB'
	});

//state
export const initialPodcast = writable(null);
export const initialEpisode = writable(null);
export const userState = writable({
	user: 'local',
	nick: 'anonymous',
	playbackSpeed: 1.0,
	volume: 100,
	enableAutoplay: true,
	playing: {
		podcast: {},
		episode: {},
		podcastState: {},
		episodeState: {}
	},
	playlist: []
});
export const loggedIn = writable(false);
export const nickName = writable('anonymous');
export const selectedPodcastState = writable({});
export const playingPodcastState = writable({});
export const playingEpisodeState = writable({});
export const enableAutoplay = writable(true);
export const updatingVersion = writable(false);
export const updatingVersionCount = writable(0);

//loadedStatus
export const isLoaded = writable(false);
export const isPlayerLoaded = writable(false);
export const userStateLoaded = writable(false);
export const nowPlayingLoaded = writable(false);
export const loadingStatus = writable('');
export const posterUrl = writable(null);
export const podcastListPane = writable('search');
export const middlePane = writable('episodesList');
export const rightPane = writable('showNotes');
export const mobileMiddlePane = writable('podcastList');
export const count = writable(0);
export const mainPodcastList = writable([]);
export const podcastList = writable([]);
export const episodesList = writable([]);
export const filteredEpisodesList = writable([]);
export const episodesListPane = writable();
export const showNotesPane = writable();
export const displayShowNotesPane = writable(false);
export const selectedEpisode = writable({});
export const selectedPodcast = writable({});
export const playingEpisode = writable({});
export const playingPodcast = writable({});
export const playingList = writable([]);
export const selectedPlayingList = writable('playlist');
export const parser = writable();

//player
export const player = writable(null);
export const htmlPlayer = writable(null);
export const playerTime = writable(0);
export const playerRemainingTime = writable('');
export const playerSaveTime = writable(0);
export const playerDuration = writable(0);
export const playerIsPaused = writable(true);
export const trackSrc = writable(null);
export const allowHls = writable(false);
export const playerSrc = writable(null);
export const playerSrcType = writable(null);
export const setTitle = writable(() => {});
export const setSubtitle = writable(() => {});
export const useP2P = writable(true);
export const saveTimeInterval = writable(10);
export const goFullscreen = writable(false);
export const showPodcastSearch = writable(false);
export const isUpdatingEpisodes = writable(false);
export const updateEpisodesProgress = writable(0);
export const playList = writable([]);
export const seenEpisodesCounts = writable({});
export const allSeenQuickDisplay = writable(true);
export const mobileNavButtons = writable([]);
export const seenEpisodes = writable(new Set());
export const pinNew = writable(true);
export const currentFunction = writable('AZ');
export const searchListPodcastSelected = writable(false);

//chapters
export const selectedEpisodeChapters = writable(null);
export const playingEpisodeChapters = writable(null);
export const chapterIndex = writable(0);
export const chapterDisplayImage = writable('');

//transcripts
export const selectedEpisodeTranscript = writable(null);
export const playingEpisodeTranscript = writable(null);
export const transcriptIndex = writable(0);
export const currentMobilePage = writable(0);
export const showMobile = writable(false);
export const showMobileChapters = writable(false);
export const mobileFullScreen = writable(false);
export const featuredPodcasts = writable({ cat: '', feeds: [] });
export const podcastSearchResults = writable({ cat: '', feeds: [] });
export const swiper = writable();
export const episodesVerticalSwiper = writable();
export const showNotesVerticalSwiper = writable();
export const showNotesModalSwiper = writable();
export const initialSlide = writable(1);
export const mediaSession = writable();
export const episodeSelector = writable({
	sorter: 'newest',
	completeStatus: true
});

export const showLogin = writable(false);

export const showCreateEpisode = writable(false);
