export default function initializeEpisodeGuid(data) {
	if (data.guid) {
		if (typeof data.guid === 'string') {
			data.guid = { '#text': data.guid };
		}
		let bool = data.guid['@_isPermaLink'] || false;
		data.guid['@_isPermaLink'] = JSON.parse(bool);
		return data.guid;
	}
	let guid = { '#text': data.enclosure?.['@_url'], '@_isPermaLink': false };

	return guid;
}

// if (!episode.guid.hasOwnProperty('#text')) {
//   let guid = { '#text': episode.guid || '' };
//   episode.guid = guid;
// }
// episode.guid['@_isPermaLink'] = episode.guid['@_isPermaLink'] || 'false';
