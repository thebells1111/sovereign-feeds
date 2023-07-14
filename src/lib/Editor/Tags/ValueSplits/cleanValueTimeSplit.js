export default async function cleanValueTimeSplit(item) {
	item['podcast:value'] = item?.['podcast:value'] || {};

	if (item?.valueTimeSplit) {
		let vts = item?.valueTimeSplit;
		if (vts) {
			let splits = []
				.concat(vts)
				.map((v) => {
					let split = {};
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
					console.log(v);
					return v;
				});

			if (splits?.length) {
				item['podcast:value']['podcast:valueTimeSplit'] = splits;
			} else {
				delete item['podcast:value']['podcast:valueTimeSplit'];
			}
		}
		console.log(item['podcast:value']);

		delete item?.valueTimeSplit;
	}

	if (Object.keys(item['podcast:value']).length === 0) {
		delete item['podcast:value'];
	}
}
