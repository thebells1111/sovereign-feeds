import getSelectorList from '$lib/Labels/HeaderSelector/getSelectorList';
import getTagHeaders from '$lib/Labels/TagHeaderList/getTagHeaders';
import getNewEpisodeHeaders from '$lib/Labels/NewEpisodeHeaders/getNewEpisodeHeaders';
import getLeftPaneSelectorList from '$lib/Labels/LeftPaneSelector/getLeftPaneSelectorList';

import { selectorList, tagHeaders, newEpisodeHeaders, leftPaneSelector } from '$/editor';

let mediums = ['podcast', 'music', 'publisher', 'musicL'];

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
	leftPaneSelector.set(
		getLeftPaneSelectorList(
			mediums.includes(data['podcast:medium']) ? data['podcast:medium'] : 'podcast'
		)
	);
}
