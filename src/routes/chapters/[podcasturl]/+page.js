import { remoteServerUrl } from '$/editor';

export async function load({ params, fetch }) {
	console.log(remoteServerUrl);
	const { podcasturl } = params;

	const urls = [
		`${remoteServerUrl}/api/queryindex?q=podcasts/byfeedurl?url=${podcasturl}`,
		`${remoteServerUrl}/api/queryindex?q=episodes/byfeedurl?url=${podcasturl}`
	];

	console.log(urls);

	const responses = await Promise.all(urls.map((url) => fetch(url)));
	const [podcastData, episodesData] = await Promise.all(responses.map((res) => res.json()));

	// Note: No more 'props' wrapper. Just return the data directly.
	return {
		podcast: podcastData.status ? podcastData.feed : null,
		episodes: podcastData.status ? episodesData.items : []
	};
}
