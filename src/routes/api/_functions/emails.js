import crypto from 'crypto-js';

export async function validPassword(password, salt) {
	try {
		return crypto.pbkdf2Sync(password, salt, 10000, 16, 'sha512').toString('hex');
	} catch (err) {
		throw err;
	}
}

export async function setPassword(password) {
	try {
		const salt = crypto.randomBytes(16).toString('hex');
		const hash = crypto.pbkdf2Sync(password, salt, 10000, 16, 'sha512').toString('hex');

		return { salt: salt, hash: hash };
	} catch (err) {
		throw err;
	}
}

const clientEmailCheck = (exports.clientEmailCheck = async function (email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
});
