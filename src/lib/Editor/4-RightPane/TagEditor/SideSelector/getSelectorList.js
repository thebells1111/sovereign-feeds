import musicList from './music';
import podcastList from './podcast';

export default function getSelectorList(type) {
	const list = { podcast: podcastList, music: musicList };

	return list[type];
}
