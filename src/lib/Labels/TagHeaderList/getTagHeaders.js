import musicHeaders from './music';
import podcastHeaders from './podcast';
import publisherHeaders from './publisher';
import musicLHeaders from './musicL';
const list = {
	podcast: podcastHeaders,
	music: musicHeaders,
	publisher: publisherHeaders,
	musicL: musicLHeaders
};

export default function getSelectorList(type) {
	return list[type];
}
