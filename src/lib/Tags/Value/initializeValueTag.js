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
							'@_type': 'lnaddress',
							'@_address': '',
							'@_customKey': '',
							'@_customValue': '',
							'@_split': '100',
							'@_fee': ''
						}
					]
				}
			];

	value.forEach((v) => {
		if (!v['@_type']) {
			v['@_type'] = 'lightning';
			v['@_method'] = 'keysend';
			v['@_suggested'] = '0.00000005000';
		}
		if (v['podcast:valueRecipient']) {
			v['podcast:valueRecipient'] = [].concat(v['podcast:valueRecipient']);
		} else {
			v['podcast:valueRecipient'] = [
				{
					'@_name': '',
					'@_type': 'lnaddress',
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
