export default function initializeValueTag(data) {
	console.log(data);
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

	console.log(value);

	value = value.find((v) => v?.['@_type'] === 'lightning');

	console.log(value);
	return value;
}
