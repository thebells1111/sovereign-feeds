import { getCollection } from './database/_db/connect';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT } = process.env;

const MAX_AGE = 10 * 24 * 60 * 60;

const createCookie = (name, value, maxAge) =>
	`${name}=${value}; Max-Age=${maxAge}; httpOnly; path=/; sameSite=Strict;  ${
		process.env.NODE_ENV === 'development' ? '' : 'secure'
	}`;

export const get = async (request) => {
	try {
		const cookies = cookie.parse(request.headers.cookie || '');
		let token = request.url.searchParams.get('token') || cookies.ss;
		const collection = await getCollection('users');

		if (!token) {
			return {
				status: 401,
				headers: {
					'set-cookie': [createCookie('ss', newToken, 0)]
				},
				body: { status: 'fail', message: 'invalid token' }
			};
		}

		try {
			const decode = jwt.verify(token, JWT);
			const { email, valueGuid } = decode;
			let user = await collection.findOne({ email });
			if (!user) {
				user = { email, validatedFeeds: [] };
				await collection.insertOne(user);
			}
			const newToken = jwt.sign({ email, valueGuid }, JWT, { expiresIn: '10d' });
			return {
				status: 200,
				headers: {
					'set-cookie': [createCookie('ss', newToken, MAX_AGE)]
				},
				body: {
					status: 'success',
					user: {
						email: user.email,
						validatedFeeds: user.validatedFeeds
					}
				}
			};
		} catch (error) {
			console.log(error);
			return {
				status: 401,
				headers: {
					'set-cookie': [createCookie('ss', newToken, 0)]
				},
				body: { status: 'fail', message: 'invalid token' }
			};
		}
	} catch (err) {
		console.log(err);

		return {
			status: 500,
			body: { message: 'Server Error' }
		};
	}
};
