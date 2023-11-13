import blankPodroll from '../blanks/podroll';
import clone from 'just-clone';

export default function initializePodrollTag(data) {
	let tag = data ? clone([].concat(data)) : clone([blankPodroll]);
	return tag;
}
