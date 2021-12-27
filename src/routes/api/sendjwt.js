import { remoteServerUrl } from '$/editor';

import dotenv from 'dotenv';

import cookie from 'cookie';
dotenv.config();

export const get = async (req) => {
	try {
		let id = req.url.searchParams.get('id');
		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;
		console.log(id);
		console.log(token);
		let res = await fetch(`${remoteServerUrl}/api/sockets?token=${token}&&id=${id}`);
		console.log(res.status);
		return {
			status: 200
		};
	} catch (error) {
		console.log(error);
		return {
			status: 200,
			body: {
				status: 'fail',
				memo: 'user not found'
			}
		};
	}
};
