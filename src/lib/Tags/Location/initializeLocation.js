import blankLocation from './blankLocation';
import clone from 'just-clone';

export default function initializeLocationTag(data) {
	if (!data) return [clone(blankLocation)];

	if (typeof data === 'string') {
		const loc = clone(blankLocation);
		loc['#text'] = data;
		return [loc];
	}

	const cloned = clone(data);
	return Array.isArray(cloned) ? cloned : [cloned];
}
