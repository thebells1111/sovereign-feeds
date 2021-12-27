import getSelectorList from '$lib/Editor/4-RightPane/TagEditor/SideSelector/getSelectorList';
import getTagHeaders from '$lib/Editor/4-RightPane/TagEditor/TagHeaderList/getTagHeaders';
import getNewEpisodeHeaders from '$lib/Editor/4-RightPane/TagEditor/NewEpisodeHeaders/getNewEpisodeHeaders';

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
