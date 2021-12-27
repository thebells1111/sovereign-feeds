import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT } = process.env;

export const get = async (request) => {
	try {
		let response;

		const token = request.url.searchParams.get('token');
		let decode;
		try {
			decode = jwt.verify(token, JWT);
		} catch (error) {
			return {
				status: 401,
				body: `<html>			
				<body>
					<p>Invalid Token. Your token may have expired. Please enter try entering your email again.</p>      
				</body>
				</html>
				`
			};
		}

		if (decode) {
			console.log(decode);

			if (decode.email) {
				const newToken = jwt.sign({ email: decode.email }, JWT, { expiresIn: '10d' });
				response = `<html>
			<head>
				<script>  
					window.localStorage.setItem('validated', 'validated');
				</script>
			</head>
			<body>
				<p>Your email has been validated. You can close this tab.</p>      
			</body>
			</html>
			`;

				return {
					status: 200,
					headers: {
						'set-cookie': [
							`ss=${newToken}; Max-Age=${
								10 * 24 * 60 * 60 * 1000
							}; httpOnly; path=/; sameSite=Strict;  ${
								process.env.NODE_ENV === 'development' ? '' : 'secure'
							}`
						]
					},
					body: response
				};
			} else {
				return {
					status: 401,
					body: 'Invalid Email'
				};
			}
		} else {
			return {
				status: 401,
				body: 'Unauthorized Access'
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
