import blankContentLink from '../blanks/contentLink';
import clone from 'just-clone';

export default function initializeContentLink(data) {
	let tag = data ? clone(data) : clone(blankContentLink);

	return tag;
}
