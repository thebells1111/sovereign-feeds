export default function initializePersonTag(data) {
	let podcastArray = data
		? [].concat(data)
		: [
				{
					'#text': '',
					'@_href': '',
					'@_img': '',
					'@_group': 'cast',
					'@_role': 'host'
				}
		  ];

	return podcastArray;
}
