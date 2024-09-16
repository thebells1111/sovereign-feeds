export default function initializeLockedTag(data) {
	console.log(data);
	data = data || {
		'#text': 'no',
		'@_owner': ''
	};
	return data;
}
