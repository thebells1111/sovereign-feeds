export default async function cleanValueTimeSplit(item, channel) {
	if (item?.['podcast:value']) {
		let vts = item?.valueTimeSplit;
		console.log(vts);
		if (vts) {
			console.log(item['podcast:value']);
			item['podcast:value'] = (() => {
				const valueRecipients = [].concat(
					item?.['podcast:value']?.['podcast:valueRecipient'] || []
				);
				const filteredRecipients = valueRecipients.filter((recipient) => recipient?.['@_address']);
				return filteredRecipients.length > 0
					? { 'podcast:valueRecipient': filteredRecipients }
					: {};
			})();

			if (!item['podcast:value']?.['podcast:valueRecipient']) {
				item['podcast:value']['@_method'] = channel['podcast:value']['@_method'];
				item['podcast:value']['@_suggested'] = channel['podcast:value']['@_suggested'];
				item['podcast:value']['@_type'] = channel['podcast:value']['@_type'];
				item['podcast:value']['podcast:valueRecipient'] = [].concat(
					channel['podcast:value']['podcast:valueRecipient']
				);
			}

			let splits = []
				.concat(vts)
				.map((v) => {
					let split = {};
					console.log(v);
					if (v['@_startTime']) {
						split['@_startTime'] = v['@_startTime'];
					} else {
						return;
					}
					if (v['@_duration']) {
						split['@_duration'] = v['@_duration'];
					} else {
						return;
					}
					split['@_remotePercentage'] = v['@_remotePercentage'] || 100;
					if (v?.['podcast:valueRecipient']) {
						v['podcast:valueRecipient'] = [].concat(v?.['podcast:valueRecipient']);
					}

					if (v['@_feedGuid'] || v?.['podcast:valueRecipient']?.some((v) => v['@_address'])) {
						if (v['@_feedGuid']) {
							split['podcast:remoteItem'] = {};
							split['podcast:remoteItem']['@_feedGuid'] = v['@_feedGuid'];
							if (v['@_itemGuid']) {
								split['podcast:remoteItem']['@_itemGuid'] = v['@_itemGuid'];
							}
						} else {
							split['podcast:valueRecipient'] = v['podcast:valueRecipient']
								.map((v) => {
									if (v['@_type'] === 'lnaddress' || !v['@_customValue']) {
										delete v['@_customValue'];
									}
									if (v['@_type'] === 'lnaddress' || !v['@_customKey']) {
										delete v['@_customKey'];
									}
									if (v['@_address']) {
										return v;
									}
								})
								.filter((v) => v);
						}

						return split;
					}
				})
				.filter((v) => {
					return v;
				});

			if (splits?.length) {
				item['podcast:value']['podcast:valueTimeSplit'] = splits.sort(
					(a, b) => a['@_startTime'] - b['@_startTime']
				);
			} else {
				delete item['podcast:value']['podcast:valueTimeSplit'];
			}
		}

		delete item.valueTimeSplit;
	}
}
