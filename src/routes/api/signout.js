export const get = async (request) => {
	return {
		status: 200,
		headers: {
			'Cache-Control': 'no-store',
			'set-cookie': [
				`ss=""; Max-Age=0; httpOnly; path=/; sameSite=Strict;  ${
					process.env.NODE_ENV === 'development' ? '' : 'secure'
				}`,
				`wk=''; Max-Age=0; httpOnly; path=/; sameSite=Strict;  ${
					process.env.NODE_ENV === 'development' ? '' : 'secure'
				}`
			]
		},
		body: {
			status: 'success',
			memo: 'signed out'
		}
	};
};
