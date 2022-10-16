import clone from 'just-clone';

export default function initializeLicenseTag(data) {
	let tag = { '#text': '', '@_url': '' };
	if (data) {
		if (data['#text']) {
			tag = data;
		} else {
			tag = { '#text': data, '@_url': '' };
		}
	}
	console.log(tag);
	return tag;
}
