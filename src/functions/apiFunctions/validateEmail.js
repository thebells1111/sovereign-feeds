import CryptoJS from 'crypto-js';

export async function validPassword(password, salt) {
	console.log(password, salt);
	try {
		var key512Bits = CryptoJS.PBKDF2(password, salt, {
			hasher: CryptoJS.algo.SHA512,
			keySize: 4,
			iterations: 10000
		});
		return key512Bits.toString(CryptoJS.enc.Hex);
	} catch (err) {
		throw err;
	}
}

export async function setPassword(password) {
	try {
		const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

		const hash = CryptoJS.PBKDF2(password, salt, {
			hasher: CryptoJS.algo.SHA512,
			keySize: 4,
			iterations: 10000
		}).toString(CryptoJS.enc.Hex);
		return { salt: salt, hash: hash };
	} catch (err) {
		throw err;
	}
}
