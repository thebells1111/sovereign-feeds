export default function initializeItunesImageTag(data) {
	let itunes = data?.['itunes:image'];

	//converts image to proper format if someone didn't include href in their item
	if (itunes) {
		if (!itunes.hasOwnProperty('@_href')) {
			itunes = { '@_href': itunes };
		}
	} else {
		itunes = { '@_href': data?.image?.url };
	}

	return itunes;
}
