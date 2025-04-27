import blankLocation from './blankLocation';
import clone from 'just-clone';

export default function initializeLocationTag(data) {
	if (!data) return [clone(blankLocation)];

	const cloned = clone(data);
	return Array.isArray(cloned) ? cloned : [cloned];
}
