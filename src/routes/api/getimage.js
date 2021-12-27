export const get = async (request) => {
	try {
		let response;
		let url = request.url.searchParams.get('url');
		url = url !== 'undefined' ? url : undefined;
		if (url) {
			const res = await fetch(url, {});

			let proxy = await res.arrayBuffer();

			response = {
				status: res.status,
				headers: {
					'Content-Type': res.headers.get('Content-Type'),
					'Cache-Control': res.headers.get('Cache-Control')
				},
				body: new Uint8Array(proxy)
			};
		}

		if (response.status === 404 || !url) {
			return { body: [] };
		}

		return response;
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: { message: 'Server Error' }
		};
	}
};

// import axios from 'axios';
// import sharp from 'sharp';

// export const get = async (request) => {
// 	let url = replacePlus(request.url.searchParams.get('url'));
// 	// let w = req.query.w;
// 	// let h = req.query.h;
// 	let w = req.query.w || 320;
// 	let h = req.query.h || w;

// 	let image = await axiosImage(url);

// 	let img = await sharp(image.data).resize(Number(w), Number(h)).webp().toBuffer();

// 	const res = await fetch(url, options);

// 	response = {
// 		status: res.status,
// 		body: await res.text()
// 	};

// 	if (response.status === 404) {
// 		// user hasn't created a todo list.
// 		// start with an empty array
// 		return { body: [] };
// 	}

// 	return response;
// };

// function replacePlus(str) {
// 	return str.replace(/\+/g, '%2B');
// }

// async function axiosImage(url) {
// 	try {
// 		const image = await axios(url, {
// 			responseType: 'arraybuffer'
// 		});
// 		return image;
// 	} catch (err) {
// 		// console.log(err);
// 		throw new Error(`Unable to get image. Url: ${url}`);
// 	}
// }
