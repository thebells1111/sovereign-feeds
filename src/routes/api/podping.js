import dotenv from 'dotenv';

if (!process.env.API_KEY) {
	dotenv.config();
}

const { PODPING } = process.env;

export const get = async (request) => {
	try {
		let options = {
			method: 'get',
			headers: {
				Authorization: PODPING,
				'User-Agent': 'Sovereign Feeds'
			}
		};

		let baseUrl = 'https://podping.cloud/?url=';
		let feed = request.url.searchParams.get('url');
		let reason = request.url.searchParams.get('reason');
		let medium = request.url.searchParams.get('medium');
		if (feed) {
			let url = baseUrl + feed;
			if (reason) {
				url = url + `&reason=${reason}`;
			}

			const res = await fetch(url, options);

			response = {
				status: res.status,
				body: await res.text()
			};

			if (response.status === 404) {
				return { body: 'Fail!' };
			}
		} else {
			response = {
				status: 500,
				body: 'No Podcast Selected'
			};
		}

		return response;
	} catch (err) {
		console.error('podping err: ', err);
		return {
			status: 500,
			body: { message: err }
		};
	}
};
