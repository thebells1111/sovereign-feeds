import crypto from 'crypto-browserify';
import dotenv from 'dotenv';

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16;

if (!process.env.JWT) {
	dotenv.config();
}

const { JWT } = process.env;

console.log('JWT: ', JWT)

export async function encrypt(text) {
	console.log(text);
	let key = JWT;
	console.log('key: ', key)
	if (!text) return;
	try {
		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
		let encrypted = cipher.update(text);

		encrypted = Buffer.concat([encrypted, cipher.final()]);

		return iv.toString('hex') + encrypted.toString('hex');
	} catch (err) {
		console.log(err);
		console.log(text);
		return;
	}
}

export async function decrypt(text) {
	let key = JWT;

	try {
		let iv = Buffer.from(text.slice(0, 32), 'hex');
		let encryptedText = Buffer.from(text.slice(32), 'hex');
		let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
		let decrypted = decipher.update(encryptedText);

		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return decrypted.toString();
	} catch (err) {
		console.log(err);
		return;
	}
}
