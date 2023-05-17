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
		let title = req.url.searchParams.get('title').split('.').join('ENCODE_DOT');
		let webhookLink = body.webhookLink;
		let webhookSecret = body.webhookSecret;
		let chapterLink = body.chapterLink;
		let chapterSecret = body.chapterSecret;
		let DO_BUCKET = body.DO_BUCKET;
		let DO_ENDPOINT = body.DO_ENDPOINT;
		let DO_ACCESS_KEY = body.DO_ACCESS_KEY;
		let DO_SECRET_KEY = body.DO_SECRET_KEY;
		let DO_ENABLED = body.DO_ENABLED;

		webhookLink = await encrypt(webhookLink);
		webhookSecret = await encrypt(webhookSecret);
		chapterLink = await encrypt(chapterLink);
		chapterSecret = await encrypt(chapterSecret);
		DO_BUCKET = await encrypt(DO_BUCKET);
		DO_ENDPOINT = await encrypt(DO_ENDPOINT);
		DO_ACCESS_KEY = await encrypt(DO_ACCESS_KEY);
		DO_SECRET_KEY = await encrypt(DO_SECRET_KEY);

		let decode;

		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;

		if (token && title) {
			const collection = await getCollection('users');
			decode = jwt.verify(token, JWT);
			console.log(decode);
			let update = {
				webhookLink: webhookLink,
				webhookSecret: webhookSecret,
				chapterLink: chapterLink,
				chapterSecret: chapterSecret,
				DO_BUCKET: DO_BUCKET,
				DO_ENDPOINT: DO_ENDPOINT,
				DO_ACCESS_KEY: DO_ACCESS_KEY,
				DO_SECRET_KEY: DO_SECRET_KEY,
				DO_ENABLED: DO_ENABLED
			};

			console.log(update);

			//removes undefined object keys
			Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

			await collection.updateOne(
				{
					email: decode.email
				},
				{
					$set: {
						[`${title}`]: update
					}
				},
				{ upsert: true }
			);

			return {
				status: 200,
				body: {
					status: 'success',
					user: {
						webhookLink: webhookLink,
						webhookSecret: webhookSecret
					}
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

export const get = async (req) => {
	try {
		let title = req.url.searchParams.get('title').split('.').join('ENCODE_DOT');
		const cookies = cookie.parse(req.headers.cookie || '');
		let token = cookies.ss;

		if (token && title) {
			const collection = await getCollection('users');
			let decode = jwt.verify(token, JWT);

			user = await collection.find({ email: decode.email }).toArray();
			user = user[0];

			user[title].webhookSecret =
				user[title].webhookSecret && (await decrypt(user[title].webhookSecret));
			user[title].webhookLink = user[title].webhookLink && (await decrypt(user[title].webhookLink));

			user[title].chapterSecret =
				user[title].chapterSecret && (await decrypt(user[title].chapterSecret));
			user[title].chapterLink = user[title].chapterLink && (await decrypt(user[title].chapterLink));

			user[title].DO_BUCKET = user[title].DO_BUCKET && (await decrypt(user[title].DO_BUCKET));

			user[title].DO_ENDPOINT = user[title].DO_ENDPOINT && (await decrypt(user[title].DO_ENDPOINT));

			user[title].DO_ACCESS_KEY =
				user[title].DO_ACCESS_KEY && (await decrypt(user[title].DO_ACCESS_KEY));

			user[title].DO_SECRET_KEY =
				user[title].DO_SECRET_KEY && (await decrypt(user[title].DO_SECRET_KEY));
			return {
				status: 200,
				body: {
					status: 'success',
					webhooks: user[title]
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
