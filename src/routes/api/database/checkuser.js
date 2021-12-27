import { decrypt, encrypt } from '../_functions/ciphers';
import { getCollection } from './_db/connect';
import cookie from 'cookie';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT } = process.env;

export const get = async (request) => {
	try {
		let user;
		let email;

		const collection = await getCollection('users');
		const cookies = cookie.parse(request.headers.cookie || '');
		let token = cookies.ss;
		let wk = cookies.wk;

		if (token) {
			let decode = jwt.verify(token, JWT);
			email = decode.email;

			user = await collection.find({ email: decode.email }).toArray();
			user = user[0];
			if (!user) {
				user = { email: email, validatedFeeds: [] };

				// Select the users collection from the database
				const result = await collection.insertOne(user);
			}
		}

		if (user) {
			const newToken = jwt.sign(
				{
					email: email
				},
				JWT,
				{
					expiresIn: '10d'
				}
			);
			if (user.wak) {
				wk = await decrypt(user.wak);
			}

			return {
				status: 200,
				headers: {
					'set-cookie': [
						`ss=${newToken}; Max-Age=${10 * 24 * 60 * 60}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`,
						`wk=${wk}; Max-Age=${
							wk ? 10 * 24 * 60 * 60 * 1000 : 0
						}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`
					]
				},
				body: {
					status: 'success',
					user: {
						email: user.email,
						validatedFeeds: user.validatedFeeds
					}
				}
			};
		} else {
			return {
				status: 200,
				headers: {
					'set-cookie': [
						`ss=''; Max-Age=${0}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`,
						`wk=''; Max-Age=${0}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`
					]
				},
				body: {
					status: 'fail',
					memo: 'user not found'
				}
			};
		}
	} catch {
		(err) => {
			console.error('checkuser: ' + err);
			return {
				status: 500,
				headers: {
					'set-cookie': [
						`ss=''; Max-Age=${0}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`,
						`wk=''; Max-Age=${0}; httpOnly; path=/; sameSite=Strict;  ${
							process.env.NODE_ENV === 'development' ? '' : 'secure'
						}`
					]
				},
				body: {
					status: 500,
					error: 'A server error occured'
				}
			};
		};
	}
};
