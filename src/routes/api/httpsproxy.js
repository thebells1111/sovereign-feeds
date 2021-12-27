export const get = async (request) => {
	try {
		let response;
		let url = request.url.searchParams.get('url');
		console.log('p: ' + url);
		url = url !== 'undefined' ? url : undefined;
		url = url !== 'null' ? url : null;

		if (url) {
			const res = await fetch(url, {});

			let proxy = await res.text();
			let parsedProxy = hasJsonStructure(proxy);

			response = {
				status: res.status,
				body: parsedProxy || proxy
			};
		} else if (response?.status === 404) {
			return { body: [] };
		}
		return response;
	} catch (err) {
		console.log('httpsproxy: ' + err);
		return {
			status: 500,
			body: { message: 'Server Error' }
		};
	}
};

function hasJsonStructure(str) {
	if (typeof str !== 'string') return false;
	try {
		return (result = JSON.parse(str));
	} catch (err) {
		return false;
	}
}
