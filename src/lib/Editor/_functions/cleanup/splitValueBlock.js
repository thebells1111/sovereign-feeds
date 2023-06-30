import clone from 'just-clone';

export default function cleanValueAudioItem(item, data) {
	let episodeValueBlock = clone(item?.['podcast:value']);
	let channelValueBlock = clone(data?.['podcast:value']);
	const valueBlock = !isEmpty(episodeValueBlock)
		? episodeValueBlock
		: !isEmpty(channelValueBlock)
		? channelValueBlock
		: null;
	function isEmpty(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	if (item.valueAudioItem?.length && valueBlock) {
		console.log(item.valueAudioItem);

		valueBlock['podcast:valueTimeSplit'] = item.valueAudioItem.map((v) => {
			console.log(v);
			if (v.albumGuid || v.value) {
				let block = {
					'@_startTime': v.added || '0',
					'@_duration': v.duration
				};

				if (v.albumGuid) {
					block['podcast:remoteItem'] = {
						'@_feedGuid': v.albumGuid,
						'@_medium': 'music'
					};
					if (v.songGuid) {
						block['podcast:remoteItem']['@_itemGuid'] = v.songGuid;
					}
				} else if (v.value) {
				}

				if (v.split) {
					block['@_remotePercentage'] = v.split;
				}
				return block;
			}
		});

		item['podcast:value'] = valueBlock;
	}

	delete item.valueAudioItem;

	return item;
}
