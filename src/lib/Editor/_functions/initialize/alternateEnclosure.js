import blankAlternateEnclosure from '../blanks/alternateEnclosure';
import clone from 'just-clone';

export default function initializeAlternateEnclosure(data) {
	let defaultStructure = clone(blankAlternateEnclosure[0]);
	let tag = data ? [].concat(clone(data)) : [defaultStructure];

	// Ensure all keys in blankAlternateEnclosure are present in each object in tag
	tag = tag.map((item) => {
		let mergedItem = { ...defaultStructure, ...item };

		// Ensure podcast:source is an array
		if (!Array.isArray(mergedItem['podcast:source'])) {
			mergedItem['podcast:source'] = [
				mergedItem['podcast:source'] || clone(defaultStructure['podcast:source'][0])
			];
		}

		return mergedItem;
	});

	return tag;
}
