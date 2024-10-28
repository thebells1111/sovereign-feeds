import musicList from './music';
import podcastList from './podcast';
import publisherList from './publisher';
import musicLList from './musicL';

export default function getLeftPaneSelectorList(type) {
	const list = {
		podcast: podcastList,
		music: musicList,
		publisher: publisherList,
		musicL: musicLList
	};

	return list[type];
}
