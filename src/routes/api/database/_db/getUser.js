import { getCollection } from './connect';

import { validPassword } from '$functions/apiFunctions/validateEmail';
import { encrypt } from '$functions/apiFunctions/ciphers';

export default async function getUser(request) {
	const body = typeof request.body === 'object' ? request.body : JSON.parse(request.body);
	let fail = false;
	const collection = await getCollection('users');
	let email = body.email;
	let user = await collection.find({ email: email }).toArray();
	user = user[0];
	if (user) {
		let hash = await validPassword(body.pw, `${user.salt}`);
		fail = hash !== user.hash;
	} else {
		fail = true;
	}

	if (!fail) {
		let email = await encrypt(`${user.email}`);

		return {
			status: 200,
			headers: {
				'set-cookie': `us=${email}; Max-Age=${
					60 * 24 * 60 * 60 * 1000
				}; httpOnly; path=/; sameSite=Strict;  ${
					process.env.NODE_ENV === 'development' ? '' : 'secure'
				}`
			},
			body: JSON.stringify({ status: 'success', memo: '' })
		};
	} else {
		return {
			status: 200,
			body: JSON.stringify({ status: 'fail', memo: 'Invalid e-mail and/or password' })
		};
	}
}
