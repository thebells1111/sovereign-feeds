import blankChat from './blankChat';
import clone from 'just-clone';

export default function initializeChatTag(data) {
	let tag = data ? clone(data) : clone(blankChat);

	return tag;
}
