import blankAlternateEnclosure from '../blanks/alternateEnclosure';
import clone from 'just-clone';

export default function initializeAlternateEnclosure(data) {
	let tag = data ? [].concat(clone(data)) : clone(blankAlternateEnclosure);

	return tag;
}
