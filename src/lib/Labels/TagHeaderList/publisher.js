const podcastHeaders = {
	episodes: {
		title: 'Title',
		imageUrl: 'Link to Episode Art',
		enclosureUrl: 'Link to Episode Audio',
		guid: 'Episode GUID',
		link: 'Link to Page with Episode',
		explicit: 'Explicit Content',
		author: 'Author',
		keywords: 'Keywords'
	},
	chapters: {
		url: 'Link to Chapters File'
	},
	transcripts: {
		url: 'Link to Transcripts File',
		cc: 'Check this box if the transcript file contains time stamps and is suitable for Closed Captions'
	},
	channel: {
		name: 'Publisher Feed Title',
		artwork: 'Publisher Feed Art',
		description: 'Publisher Feed Description',
		keywords: 'Keywords',
		mediaType: 'Media Type',
		guid: 'GUID',
		link: 'Link to Publisher Website',
		author: 'Author',
		complete: 'Podcast Complete',
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

export default podcastHeaders;
