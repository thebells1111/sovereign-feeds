import dotenv from 'dotenv';
import { error } from '@sveltejs/kit';

if (!process.env.API_KEY) {
	dotenv.config();
}

const { PODPING } = process.env;

export async function GET(event) {
	try {
		let options = {
			method: 'GET',
			headers: {
				Authorization: PODPING,
				'User-Agent': 'Sovereign Feeds'
			}
		};

		let baseUrl = 'https://podping.cloud/?url=';
		let feed = event.url.searchParams.get('url');
		let reason = event.url.searchParams.get('reason');
		let medium = event.url.searchParams.get('medium');
		let response;

		if (feed) {
			let url = baseUrl + encodeURIComponent(feed);
			if (reason) {
				url += `&reason=${encodeURIComponent(reason)}`;
			}

			const res = await fetch(url, options);

			response = {
				status: res.status,
				body: await res.text()
			};

			if (response.status === 404) {
				return new Response('Fail!', { status: 404 });
			}
		} else {
			response = {
				status: 500,
				body: 'No Podcast Selected'
			};
		}

		return new Response(response.body, { status: response.status });
	} catch (err) {
		console.error('podping err: ', err);
		return new Response(JSON.stringify({ message: err.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
