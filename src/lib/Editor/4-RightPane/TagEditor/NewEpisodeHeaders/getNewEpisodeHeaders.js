import musicHeaders from './music';
import podcastHeaders from './podcast';
const list = { podcast: podcastHeaders, music: musicHeaders };

export default function getHeaders(type) {
	return list[type];
}
