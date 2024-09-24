import blankPodroll from './blankPodroll';
import clone from 'just-clone';

export default function initializePodrollTag(data) {
	console.log(data);
	if (data?.['podcast:remoteItem']) {
		data['podcast:remoteItem'] = clone([].concat(data['podcast:remoteItem']));
	} else {
		console.log(blankPodroll);
		data = clone(blankPodroll);
	}
	console.log(data);

	return data;
}
