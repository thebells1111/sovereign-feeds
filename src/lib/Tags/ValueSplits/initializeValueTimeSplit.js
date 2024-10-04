import { remoteServerUrl } from '$/editor';

export default async function initializeValueTimeSplit(episode) {
	if (episode?.['podcast:value']?.['podcast:valueTimeSplit']) {
		let podcastItems = [].concat(episode?.['podcast:value']?.['podcast:valueTimeSplit']);
		const timeSplits = [];

		for (let i = 0; i < podcastItems.length; i++) {
			let v = podcastItems[i];
			const feedGuid = v?.['podcast:remoteItem']?.['@_feedGuid'];
			const itemGuid = v?.['podcast:remoteItem']?.['@_itemGuid'];

			const feedGuidUrl =
				remoteServerUrl +
				`/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${feedGuid}`)}`;
			const itemsUrl =
				remoteServerUrl +
				`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${feedGuid}`)}`;

			const [feedData, itemsData] = await Promise.all([
				fetch(feedGuidUrl).then((res) => res.json()),
				fetch(itemsUrl).then((res) => res.json())
			]).catch((error) => {
				console.error('Error:', error);
			});

			let items = []
				.concat(itemsData?.liveItems)
				.concat(itemsData?.items)
				.filter((v) => v);
			let feed = feedData?.feed;
			let item = items.find((v) => v?.guid === itemGuid);
			let vts = {
				feed: feed?.title,
				item: item?.title,
				'@_feedGuid': feed?.podcastGuid,
				'@_itemGuid': item?.guid || itemGuid,
				'@_startTime': v?.['@_startTime'],
				'@_duration': v?.['@_duration'],
				'@_remotePercentage': v?.['@_remotePercentage'],
				'podcast:valueRecipient': v?.['podcast:valueRecipient'] || []
			};

			timeSplits.push(vts);
		}

		return timeSplits;
	} else {
		return [
			{
				feed: '',
				item: '',
				'@_feedGuid': '',
				'@_itemGuid': '',
				'@_startTime': '',
				'@_duration': '',
				'@_remotePercentage': '',
				valueRecipient: [
					{
						'@_name': '',
						'@_address': '',
						'@_type': 'node',
						'@_customKey': '',
						'@_customValue': '',
						'@_split': ''
					}
				]
			}
		];
	}
}
