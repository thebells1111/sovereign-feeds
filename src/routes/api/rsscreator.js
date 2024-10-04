import { parse } from 'fast-xml-parser';
import { decode } from 'html-entities';
// const fetch = require('node-fetch');

export const get = async (request) => {
	try {
		let url = request.url.searchParams.get('url');
		console.log(url);
		const response = await fetch(url, {
			'User-Agent': 'SovereignFeeds'
		});
		const feed = (await response.text()) || {};

		const parserOptions = {
			attributeNamePrefix: '@_',
			//attrNodeName: false,
			//textNodeName : "#text",
			ignoreAttributes: false,
			ignoreNameSpace: false,
			attrValueProcessor: (val, attrName) => decode(val), //default is a=>a
			tagValueProcessor: (val, tagName) => decode(val) //default is a=>a
		};

		xmlJson = parse(feed, parserOptions);

		if (xmlJson) {
			return { status: 200, body: xmlJson };
		} else {
			return { status: 304 };
		}
	} catch (err) {
		console.log('getepisodes.js Error:', err);
		return { status: 500, body: [] };
	}
};
