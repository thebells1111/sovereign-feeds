import blankTranscript from '../blanks/transcript';
import clone from 'just-clone';

export default function initializeTranscriptTag(data) {
	let tag = data ? clone([].concat(data)) : clone([blankTranscript]);

	return tag;
}
