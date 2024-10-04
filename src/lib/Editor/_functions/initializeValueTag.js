export default function initializeValueTag(data) {
	let value = data
		? [].concat(data)
		: [
				{
					'@_type': 'lightning',
					'@_method': 'keysend',
					'@_suggested': '0.00000005000',
					'podcast:valueRecipient': [
						{
							'@_name': '',
							'@_type': 'node',
							'@_address': '',
							'@_customKey': '',
							'@_customValue': '',
							'@_split': '',
							'@_fee': ''
						}
					]
				}
		  ];

	value.forEach((v) => {
		if (v['podcast:valueRecipient']) {
			v['podcast:valueRecipient'] = [].concat(v['podcast:valueRecipient']);
		} else {
			v['podcast:valueRecipient'] = [
				{
					'@_name': '',
					'@_type': 'node',
					'@_address': '',
					'@_customKey': '',
					'@_customValue': '',
					'@_split': '',
					'@_fee': ''
				}
			];
		}
	});

	value = value.find((v) => v?.['@_type'] === 'lightning');

	return value;
}
