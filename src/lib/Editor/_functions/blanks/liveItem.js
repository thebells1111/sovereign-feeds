function addHours(t) {
	let d = new Date();
	let h = d.getHours() + t;
	d.setHours(h);
	return d.toISOString();
}

const liveItem = {
	'@_status': 'pending',
	'@_start': {
		dateTime: new Date().toISOString(),
		hour: 3,
		minute: 33,
		meridian: false,
		duration: {
			hour: 1,
			minute: 30
		}
	},
	'@_chat': '',
	title: 'New Live Episode',
	author: null,
	description: '',
	duration: null,
	enclosure: { '@_length': null, '@_type': null, '@_url': null },
	guid: { '#text': null, '@_isPermaLink': false },
	'itunes:image': { '@_href': null },
	'itunes:keywords': null,
	'itunes:subtitle': null,
	'itunes:summary': null,
	link: null,
	'podcast:contentLink': { '#text': null, '@_href': null },
	'podcast:chapters': { '@_url': null },
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
				'@_type': 'node',
				'@_address': '',
				'@_customKey': '',
				'@_customValue': '',
				'@_split': '',
				'@_fee': ''
			}
		]
	}
};

export default liveItem;
