export default function initializeValueTag(data) {
	let value = data
		? [].concat(data)
		: [
				{
					'@_type': 'lightning',
					'@_method': 'keysend',
					'@_suggested': '0.00000005000',
					'podcast:valueRecipient': []
				}
		  ];

	value.forEach((v) => (v['podcast:valueRecipient'] = [].concat(v['podcast:valueRecipient'])));

	value = value.find((v) => v?.['@_type'] === 'lightning');

	return value;
}
