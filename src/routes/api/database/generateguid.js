import { v4 as uuidv4 } from 'uuid';
import { getCollection } from './_db/connect';
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
		const collection = await getCollection('sharedValueLinks');
		const cookies = cookie.parse(request.headers.cookie || '');
		const token = cookies.ss;

		if (!token) {
			throw new Error('Token not found');
		}

		const { email } = jwt.verify(token, JWT);

		// Generate GUID and check if it exists in sharedValueLinks array
		let guid = uuidv4();
		do {
			guid = uuidv4();
			sharedValueLink = await collection.findOne({ guid });
		} while (sharedValueLink);

		await collection.insertOne({ guid, email });

		const newToken = jwt.sign({ email, valueGuid: guid }, JWT, { expiresIn: '10d' });

		console.log(guid);

		return {
			status: 200,
			headers: {
				'set-cookie': [createCookie('ss', newToken, MAX_AGE)]
			},
			body: {
				status: 'success',
				guid // Return the newly generated GUID
			}
		};
	} catch (err) {
		console.error('generateGuid: ' + err);
		return {
			status: 500,
			headers: {
				'set-cookie': [createCookie('ss', '', 0)]
			},
			body: {
				status: 500,
				error: 'A server error occurred'
			}
		};
	}
};
