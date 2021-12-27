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
		let chapterLink = body.chapterLink;
		let chapterContent = body.chapterContent;

		let decode;

		console.log(chapterLink);

		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;

		if (token) {
			const collection = await getCollection('chapters');
			decode = jwt.verify(token, JWT);

			await collection.updateOne(
				{
					link: chapterLink
				},
				{
					$set: {
						[`${decode.email.split('.').join('%20')}`]: chapterContent
					}
				},
				{ upsert: true }
			);

			return {
				status: 200,

				body: {
					status: 'success'
				}
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

export const get = async (req) => {
	try {
		let chapterLink = req.url.searchParams.get('link');
		console.log(chapterLink);
		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;

		if (token && chapterLink) {
			const collection = await getCollection('chapters');
			let decode = jwt.verify(token, JWT);
			let encodedEmail = `${decode.email.split('.').join('%20')}`;

			// .find(
			// 	{ [`${decode.email.split('.').join('%20')}`]: { $exists: true }, link: chapterLink },
			// 	{ [`${decode.email.split('.').join('%20')}`]: 1 }
			// )

			let chapters = await collection
				.aggregate([
					{ $match: { [encodedEmail]: { $exists: true }, link: chapterLink } },
					{ $project: { [encodedEmail]: 1, _id: 0 } }
				])
				.toArray();
			chapters = chapters[0];
			console.log(chapters);

			return {
				status: 200,
				body: {
					status: 'success',
					chapters: chapters?.[encodedEmail] || []
				}
			};
		}
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
