import blankLiveItem from '../blanks/liveItem';
import clone from 'just-clone';

export default function initializeLiveItem(data) {
	let podcastArray = data ? [].concat(data) : clone([blankLiveItem]);
	podcastArray['@_status'] = podcastArray['@_status'].map((v) => {
		v['@_status'] = v['@_status'] || 'pending';
		v['@_status'] = v['@_status'].toLowerCase();
		console.log(v);
		return v;
	});
	return podcastArray;
}
