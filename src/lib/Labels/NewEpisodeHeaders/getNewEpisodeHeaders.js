import musicHeaders from './music';
import podcastHeaders from './podcast';
import publisherHeaders from './publisher';
const list = { podcast: podcastHeaders, music: musicHeaders, publisher: publisherHeaders };

export default function getHeaders(type) {
	return list[type];
}
