import { getCollection } from './connect';

import { setPassword } from '$functions/apiFunctions/validateEmail';
import { encrypt } from '$functions/apiFunctions/ciphers';

export default async function createUser(request, body) {
	const collection = await getCollection('users');

	const user = await collection.find({ email: body.email }).toArray();
	if (user.length > 0) {
		return { status: 200, body: JSON.stringify({ status: 'fail', memo: 'E-mail already taken' }) };
	} else {
		let pw = await setPassword(body.pw);
		const user = { email: body.email, ...pw };

		// Select the users collection from the database
		const result = await collection.insertOne(user);
		let encryptedEmail = await encrypt(`${body.email}`);

		return {
			status: 200,
			headers: {
				'set-cookie': `us=${encryptedEmail}; Max-Age=${
					60 * 24 * 60 * 60 * 1000
				}; httpOnly; path=/; sameSite=Strict;  ${
					process.env.NODE_ENV === 'development' ? '' : 'secure'
				}`
			},
			body: JSON.stringify({ status: 'success', memo: '' })
		};
	}
}
