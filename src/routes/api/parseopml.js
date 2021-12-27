import parseOpml from 'node-opml-parser';

export const post = async (request) => {
	try {
		const body = typeof request.body === 'object' ? request.body : JSON.parse(request.body);
		let opml = body.opml;

		let items = await opmlPromise(opml);

		return {
			status: 200,
			body: items
		};
	} catch (err) {
		console.error('parseopml err: ', err);
		return {
			status: 500,
			body: { message: 'Server Error' }
		};
	}
};

let opmlPromise = function (data) {
	return new Promise((resolve, reject) => {
		parseOpml(data, (err, items) => {
			if (err) reject(err);
			else resolve(items);
		});
	});
};
