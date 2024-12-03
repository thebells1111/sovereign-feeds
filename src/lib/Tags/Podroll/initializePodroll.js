import blankPodroll from './blankPodroll';
import clone from 'just-clone';

export default function initializePodrollTag(data) {
	if (data?.['podcast:remoteItem']) {
		data['podcast:remoteItem'] = clone([].concat(data['podcast:remoteItem']));
	} else {
		console.log(blankPodroll);
		data = clone(blankPodroll);
	}

	return data;
}
