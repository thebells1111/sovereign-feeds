const musicHeaders = {
	episodes: {
		title: 'Name of Song',
		imageUrl: 'Link to Song Art',
		enclosureUrl: 'Link to Song File',
		guid: 'Song GUID',
		link: 'Link to Page with Song',
		explicit: 'Explicit Content',
		author: 'Band Name',
		keywords: 'Keywords'
	},
	chapters: {
		url: 'Link to Time Stamped Song Art File (aka Chapters)'
	},
	transcripts: {
		url: 'Link to Lyrics File (aka Transcripts)',
		cc: 'Check this box if the lyrics file contains time stamps and is suitable for Closed Captions'
	},
	podcast: {
		name: 'Album Name',
		artwork: 'Album Art',
		description: 'Album Description',
		keywords: 'Keywords',
		mediaType: 'Media Type',
		guid: 'GUID',
		link: 'Link to Album Website',
		author: 'Band Name',
		complete: 'Album Complete',
		editor: 'Feed Editor',
		owner: 'Feed Owner',
		funding: {
			title: 'Support',
			block: 'Support Block',
			text: 'Phrase to ask for Support',
			url: 'Link to Support Page'
		}
	}
};

export default musicHeaders;
