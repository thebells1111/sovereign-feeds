import crypto from 'crypto-browserify';
import dotenv from 'dotenv';

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16;

dotenv.config();
const { WEBHOOK_KEY } = process.env;

if (!WEBHOOK_KEY) {
	console.error('Error: WEBHOOK_KEY is not set in environment variables.');
	process.exit(1);
}

export async function encrypt(text) {
	if (!text) return;

	try {
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(algorithm, Buffer.from(WEBHOOK_KEY), iv);
		let encrypted = cipher.update(text);

		encrypted = Buffer.concat([encrypted, cipher.final()]);

		return iv.toString('hex') + encrypted.toString('hex');
	} catch (err) {
		console.error('Error encrypting:', err, text);
		return;
	}
}

export async function decrypt(text) {
	try {
		const iv = Buffer.from(text.slice(0, 32), 'hex');
		const encryptedText = Buffer.from(text.slice(32), 'hex');
		const decipher = crypto.createDecipheriv(algorithm, Buffer.from(WEBHOOK_KEY), iv);
		let decrypted = decipher.update(encryptedText);

		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return decrypted.toString();
	} catch (err) {
		console.error('Error decrypting:', err);
		return;
	}
}
