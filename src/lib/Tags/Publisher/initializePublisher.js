import clone from 'just-clone';

export default function initializePublisherTag(data) {
	if (data) {
		data = clone([].concat(data));
	} else {
		data = [];
	}

	return data;
}
