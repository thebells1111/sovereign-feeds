import getSelectorList from '$lib/Editor/Tags/SideSelector/getSelectorList';
import getTagHeaders from '$lib/Editor/Tags/TagHeaderList/getTagHeaders';
import getNewEpisodeHeaders from '$lib/Editor/Tags/NewEpisodeHeaders/getNewEpisodeHeaders';

import { selectorList, tagHeaders, newEpisodeHeaders } from '$/editor';

let mediums = ['podcast', 'music'];

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
