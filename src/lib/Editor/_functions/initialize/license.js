export default function initializeLicenseTag(data) {
	let tag = { '#text': '', '@_url': '' };
	if (data) {
		if (data.hasOwnProperty('#text')) {
			tag = data;
		} else {
			tag = { '#text': data, '@_url': '' };
		}
	}
	return tag;
}
