import parseOpml from 'node-opml-parser';

export async function POST(event) {
	try {
		const body = await event.request.json();
		let opml = body.opml;

		let items = await opmlPromise(opml);

		return new Response(JSON.stringify(items), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		console.error('parseopml err: ', err);
		return new Response(JSON.stringify({ message: 'Server Error' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

const opmlPromise = function (data) {
	return new Promise((resolve, reject) => {
		parseOpml(data, (err, items) => {
			if (err) reject(err);
			else resolve(items);
		});
	});
};
