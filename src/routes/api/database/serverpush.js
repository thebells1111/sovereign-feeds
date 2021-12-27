import { getCollection } from './_db/connect';
import cookie from 'cookie';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../_functions/ciphers';
dotenv.config();

const { JWT } = process.env;

export const post = async (req) => {
	try {
		const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
		let xml = body.xml;
		let chapters = body.chapters;
		let title = body.title;

		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;

		if (token) {
			const collection = await getCollection('users');
			decode = jwt.verify(token, JWT);

			user = await collection.find({ email: decode.email }).toArray();
			user = user[0];
			if (!user) {
				return {
					status: 200,

					body: {
						status: 'fail',
						message: 'User Not Found. Please Log In.'
					}
				};
			}

			if (!title) {
				return {
					status: 200,

					body: {
						status: 'fail',
						message: 'Please Select a Feed'
					}
				};
			}

			let link;
			let secret;
			let file;
			let serverData = {};

			let feedTitle = user?.[title.split('.').join('ENCODE_DOT')];

			if (xml) {
				link = feedTitle?.webhookLink;
				secret = feedTitle?.webhookSecret;
				serverData.xml = xml;
			} else if (chapters) {
				link = feedTitle?.chapterLink;
				secret = feedTitle?.chapterSecret;
				serverData.chapters = chapters;
			}

			try {
				if (link) {
					link = await decrypt(link);
				} else {
					throw new Error();
				}
			} catch (error) {
				return {
					status: 200,

					body: {
						status: 'fail',
						message: 'No Sever Link Provided'
					}
				};
			}

			try {
				secret = await decrypt(secret);
			} catch (error) {
				secret = '';
			}

			let res = await fetch(link, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${secret}`,
					credentials: 'omit',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(serverData)
			});
			let data = await res.json();
			console.log(data);

			return {
				status: 200,

				body: data
			};
		}
	} catch (error) {
		console.log(error);
		return {
			status: 200,
			// headers: {
			// 	'set-cookie': [
			// 		`ss=""; Max-Age=0; httpOnly; path=/; sameSite=Strict;  ${
			// 			process.env.NODE_ENV === 'development' ? '' : 'secure'
			// 		}`
			// 	]
			// },
			body: {
				status: 'fail',
				memo: 'user not found'
			}
		};
	}
};
