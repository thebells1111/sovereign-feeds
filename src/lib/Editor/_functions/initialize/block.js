export default function initializeBlockTag(data) {
	if (data) {
		data = [].concat(data);
	} else {
		data = [
			{
				'#text': 'no'
			}
		];
	}

	//moves main block to front
	if (data[0]['@_id']) {
		let index = data.findIndex((v) => !v['@_id']);
		if (index > -1) {
			data.unshift(data.splice(index, 1)[0]);
		} else {
			data.unshift({
				'#text': 'no'
			});
		}
	}

	if (!data[0]['#text']) {
		data[0] = { '#text': data[0] };
	}

	data.forEach((v) => {
		if (!v['@_id']) {
			delete v['@_id'];
		}
	});
	return data;
}
