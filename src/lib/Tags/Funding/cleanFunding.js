export default function cleanChat(data) {
	if (data['podcast:funding']) {
		let funding = [].concat(data['podcast:funding']);
		let newFunding = [];
		funding.forEach((v) => {
			if (!v['#text']) {
				v['#text'] = 'Support the Show';
			}
			if (v['@_url']) {
				newFunding.push(v);
			}
		});

		data['podcast:funding'] = newFunding;
	}
}
