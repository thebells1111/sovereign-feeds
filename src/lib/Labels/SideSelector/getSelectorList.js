import musicList from './music';
import podcastList from './podcast';
import publisherList from './publisher';

export default function getSelectorList(type) {
	const list = { podcast: podcastList, music: musicList, publisher: publisherList };

	return list[type];
}
