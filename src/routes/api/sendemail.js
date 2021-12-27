import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const { MAIL_USER, MAIL_PW, MAIL_HOST, MAIL_PORT, JWT, MAIL_LINK } = process.env;

export const post = async (req) => {
	const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
	const email = body.email;
	if (body.type === 'signin' && email) {
		const token = jwt.sign({ email: email }, JWT, { expiresIn: '10m' });
		let transporter = nodemailer.createTransport({
			host: MAIL_HOST,
			secure: true,
			port: MAIL_PORT,
			auth: {
				user: MAIL_USER,
				pass: MAIL_PW
			}
		});

		let from = `Sovereign Feeds <stevenb@sovereignfeeds.com>`;

		const mailOptions = {
			from: from, // sender address
			to: email,
			subject: 'Sovereign Feeds Sign In Request', // Subject line
			html: `<a href="${MAIL_LINK}api/verify-token?token=${token}">Click here to sign in to your Sovereign Feeds account.</a>` // plain text body
		};

		let info = await transporter.sendMail(mailOptions);

		return {
			status: 200,
			body: { success: 'Mail Time!!!' }
		};
	} else {
		return {
			status: 200,
			body: 'No URL provided'
		};
	}
};
