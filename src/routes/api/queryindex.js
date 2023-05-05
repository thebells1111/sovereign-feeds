import dotenv from 'dotenv';
import crypto from 'crypto-browserify';

if (!process.env.API_KEY) {
	dotenv.config();
}

const { API_KEY, API_SECRET } = process.env;

export const get = async (request) => {
	try {
		// ======== Hash them to get the Authorization token ========

		var apiHeaderTime = Math.floor(Date.now() / 1000);
		var sha1Algorithm = 'sha1';
		var sha1Hash = crypto.createHash(sha1Algorithm);
		var data4Hash = API_KEY + API_SECRET + apiHeaderTime;
		sha1Hash.update(data4Hash);
		var hash4Header = sha1Hash.digest('hex');

		let options = {
			method: 'get',
			headers: {
				// not needed right now, maybe in future:  "Content-Type": "application/json",
				'X-Auth-Date': '' + apiHeaderTime,
				'X-Auth-Key': API_KEY,
				Authorization: hash4Header,
				'User-Agent': 'CurioCaster'
			}
		};

		let baseUrl = 'https://api.podcastindex.org/api/1.0/';
		let q = request.url.searchParams.get('q');
		var url = baseUrl + q;
		console.log(url);
		const res = await fetch(url, options);

		response = {
			status: res.status,
			body: await res.text()
		};

		try {
			let b = JSON.parse(response.body);
			response.body = b;
		} catch (error) {}

		if (response.status === 404) {
			// user hasn't created a todo list.
			// start with an empty array
			return { body: [] };
		}

		return response;
	} catch (err) {
		console.error('queryindex err: ', err);
		return {
			status: 500,
			body: { message: err }
		};
	}
};
