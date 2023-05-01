export default async function initializeValueTimeSplit(episode) {
	console.log(episode);
	if (episode?.['podcast:value']?.['podcast:valueTimeSplit']) {
		console.log(episode?.['podcast:value']?.['podcast:valueTimeSplit']);

		let podcastItems = [].concat(episode?.['podcast:value']?.['podcast:valueTimeSplit']);
		const episodes = [];

		for (let i = 0; i < podcastItems.length; i++) {
			let v = podcastItems[i];
			const albumGuid = v?.['podcast:remoteItem']?.['@_feedGuid'];
			const songGuid = v?.['podcast:remoteItem']?.['@_itemGuid'];

			const feedGuidUrl = `/api/queryindex?q=${encodeURIComponent(
				`/podcasts/byguid?guid=${albumGuid}`
			)}`;
			const itemsUrl = `/api/queryindex?q=${encodeURIComponent(
				`/episodes/bypodcastguid?guid=${albumGuid}`
			)}`;

			const [feedData, itemsData] = await Promise.all([
				fetch(feedGuidUrl).then((res) => res.json()),
				fetch(itemsUrl).then((res) => res.json())
			]).catch((error) => {
				console.error('Error:', error);
			});

			let items = [].concat(itemsData?.items);
			let feed = feedData?.feed;
			let song = items.find((v) => (v.guid = songGuid));

			let _id = await generateHashedId(song.enclosureUrl);
			episodes[i] = {
				_id,
				song: song?.title,
				value: song?.value || feed?.value,
				albumGuid,
				songGuid,
				split: v?.['@_remoteSplit'] || 100,
				added: Number(v?.['@_startTime']),
				duration: Number(v?.['@_duration']),
				album: feed?.title,
				author: feed?.author,
				url: song.enclosureUrl
			};
		}
		console.log(episodes);
		return episodes;
	} else {
		return [];
	}
}

async function generateHashedId(url) {
	const encoder = new TextEncoder();
	const episode = encoder.encode(`${url}:${new Date().getTime()}`);
	const digest = await crypto.subtle.digest('SHA-256', episode);
	const hashArray = Array.from(new Uint8Array(digest));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}
