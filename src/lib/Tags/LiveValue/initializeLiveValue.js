import blankLiveValue from './blankLiveValue';
import clone from 'just-clone';

export default function initializeLiveValueTag(data) {
	let tag = data ? clone(data) : clone(blankLiveValue);

	return tag;
}
