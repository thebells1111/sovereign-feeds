import { remoteServerUrl } from '$/editor';

export default async function cleanValueTimeSplit(item) {
	item['podcast:value'] = item['podcast:value'] || {};
	delete item['podcast:value']['podcast:valueTimeSplits'];

	if (item?.valueTimeSplit) {
		console.log(item?.valueTimeSplit);

		let vts = item?.valueTimeSplit;
		if (vts) {
			console.log(vts);
			let splits = []
				.concat(vts)
				.map((v) => {
					console.log(v);
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
						split['podcast:remoteItem'] = {};
						if (v['@_feedGuid']) {
							console.log(v);
							split['podcast:remoteItem']['@_feedGuid'] = v['@_feedGuid'];
							if (v['@_itemGuid']) {
								split['podcast:remoteItem']['@_itemGuid'] = v['@_itemGuid'];
							}
						} else {
							console.log(v);
							split['podcast:valueRecipient'] = v['podcast:valueRecipient']
								.map((v) => {
									if (v['@_address']) {
										return v;
									}
								})
								.filter((v) => v);
						}

						return v;
					}
				})
				.filter((v) => {
					console.log(v);
					return v;
				});

			if (splits?.length) {
				item['podcast:value']['podcast:valueTimeSplits'] = splits;
			} else {
				delete item['podcast:value']['podcast:valueTimeSplits'];
			}
		}

		delete item?.valueTimeSplit;
	}
}
