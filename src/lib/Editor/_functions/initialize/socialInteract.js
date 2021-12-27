import blankSocialInteract from '../blanks/socialInteract';
import clone from 'just-clone';

export default function initializeSocialInteractTag(data) {
	let tag = data ? clone([].concat(data)) : clone([blankSocialInteract]);

	return tag;
}
