import getSelectorList from '$lib/Labels/SideSelector/getSelectorList';
import getTagHeaders from '$lib/Labels/TagHeaderList/getTagHeaders';
import getNewEpisodeHeaders from '$lib/Labels/NewEpisodeHeaders/getNewEpisodeHeaders';

import { selectorList, tagHeaders, newEpisodeHeaders } from '$/editor';

let mediums = ['podcast', 'music', 'publisher'];

export default function setHeaderText(data) {
	selectorList.set(
		getSelectorList(mediums.includes(data['podcast:medium']) ? data['podcast:medium'] : 'podcast')
	);
	tagHeaders.set(
		getTagHeaders(mediums.includes(data['podcast:medium']) ? data['podcast:medium'] : 'podcast')
	);
	newEpisodeHeaders.set(
		getNewEpisodeHeaders(
			mediums.includes(data['podcast:medium']) ? data['podcast:medium'] : 'podcast'
		)
	);
}
