import { remoteServerUrl } from '$/editor';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const { podcasturl, episodeurl } = params;

	// We can define the fetch logic directly in the load function
	const fetchChapters = async () => {
		try {
			const res1 = await fetch(`/api/rsscreator?url=${encodeURIComponent(podcasturl)}`);
			const feed = await res1.json();

			const episodes = feed?.rss?.channel?.item || [];
			const selectedEpisode = episodes.find((item) => item.enclosure?.['@_url'] === episodeurl);
			const title = feed?.rss?.channel?.title;

			let chapters = [{ title: '', url: '', img: '', startTime: 0 }];

			const chaptersUrl = selectedEpisode?.['podcast:chapters']?.['@_url'];

			if (chaptersUrl) {
				const res2 = await fetch(
					`${remoteServerUrl}/api/proxy?url=${encodeURIComponent(chaptersUrl)}`
				);
				const json = await res2.json();
				chapters = json.chapters || chapters;
			}

			return { chapters, episode: selectedEpisode, title };
		} catch (error) {
			console.error('Load error:', error);
			return { chapters: [], episode: null, title: '' };
		}
	};

	const data = await fetchChapters();

	// Direct return for the component to consume
	return {
		podcast: podcasturl,
		enclosure: episodeurl,
		...data
	};
}
