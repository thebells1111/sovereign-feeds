const item = {
	title: 'New Episode',
	author: null,
	description: '',
	enclosure: { '@_length': null, '@_type': null, '@_url': null },
	guid: { '#text': null, '@_isPermaLink': false },
	'itunes:image': { '@_href': null },
	'itunes:keywords': null,
	'itunes:subtitle': null,
	'itunes:summary': null,
	'itunes:duration': 0,
	link: null,
	'podcast:contentLink': { '#text': null, '@_href': null },
	'podcast:chapters': { '@_url': null, '@_type': 'application/json', boostagrams: false },
	'podcast:person': [
		{
			'#text': '',
			'@_href': '',
			'@_img': '',
			'@_group': 'cast',
			'@_role': 'host'
		}
	],
	'podcast:value': {
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
				'@_split': '',
				'@_fee': ''
			}
		]
	}
};

export default item;
