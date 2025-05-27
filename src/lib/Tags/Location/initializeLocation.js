import blankLocation from './blankLocation';
import clone from 'just-clone';

export default function initializeLocationTag(data) {
	console.log(data);
	if (!data) return [clone(blankLocation)];

	let entries = Array.isArray(data) ? data : [data];

	// Filter only valid object entries
	entries = entries.filter(
		(item) => typeof item === 'object' && item !== null && !Array.isArray(item)
	);

	const cleaned = entries
		.map((entry) => {
			const cleanEntry = {};

			for (const key in entry) {
				// Skip numeric keys like "0", "1", etc.
				if (!/^\d+$/.test(key)) {
					cleanEntry[key] = entry[key];
				}
			}

			// Drop if #text is missing or empty
			if (!cleanEntry['#text'] || cleanEntry['#text'].trim() === '') {
				return null;
			}

			// If only #text remains, use blankLocation
			const keys = Object.keys(cleanEntry);
			if (keys.length === 1 && keys[0] === '#text') {
				const loc = clone(blankLocation);
				loc['#text'] = cleanEntry['#text'].trim();
				return loc;
			}

			// Return cleaned object
			cleanEntry['#text'] = cleanEntry['#text'].trim();
			return cleanEntry;
		})
		.filter(Boolean); // Remove nulls

	return cleaned.length ? cleaned : undefined;
}
