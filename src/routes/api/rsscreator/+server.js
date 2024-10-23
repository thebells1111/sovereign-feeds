import { parse } from 'fast-xml-parser';
import { decode } from 'html-entities';

export async function GET(event) {
	try {
		let url = event.url.searchParams.get('url');
		console.log(url);
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'SovereignFeeds'
			}
		});
		const feed = (await response.text()) || {};

		const parserOptions = {
			attributeNamePrefix: '@_',
			ignoreAttributes: false,
			ignoreNameSpace: false,
			attrValueProcessor: (val) => decode(val), // default is a => a
			tagValueProcessor: (val) => decode(val) // default is a => a
		};

		const xmlJson = parse(feed, parserOptions);
		console.log(xmlJson);

		if (xmlJson) {
			return new Response(JSON.stringify(xmlJson), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			return new Response(null, { status: 304 });
		}
	} catch (err) {
		console.log('rsscreator Error:', err);
		return new Response(null, { status: 500 });
	}
}
