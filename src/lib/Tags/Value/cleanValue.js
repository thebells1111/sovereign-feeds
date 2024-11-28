export default function cleanValue(data) {
	if (Object.keys(data['podcast:value']).length === 0) {
		delete data['podcast:value'];
	}

	if (
		!data?.['podcast:value']?.['podcast:valueRecipient']?.[0]?.['@_address'] ||
		!data['podcast:value']['podcast:valueRecipient'][0]['@_split']
	) {
		delete data['podcast:value'];
		return;
	}

	data['podcast:value']['podcast:valueRecipient'] = data['podcast:value'][
		'podcast:valueRecipient'
	].filter((v) => {
		if (!v['@_name']) {
			delete v['@_name'];
		}
		if (v['@type'] === 'lnaddress' || !v['@_customKey']) {
			delete v['@_customKey'];
		}
		if (v['@type'] === 'lnaddress' || !v['@_customValue']) {
			delete v['@_customValue'];
		}
		if (!v['@_fee']) {
			delete v['@_fee'];
		}
		if (!v['@_address'] || !v['@_split']) {
			return false;
		}

		//use this to update address for SF
		if (
			v['@_address'] === '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3' &&
			v['@_customValue'] === 'eChoVKtO1KujpAA5HCoB'
		) {
			v['@_address'] = '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8';
			delete v['@_customKey'];
			delete v['@_customValue'];
		}
		return true;
	});

	if (
		!data['podcast:value']['podcast:valueRecipient']?.[0]?.['@_address'] ||
		!data['podcast:value']['podcast:valueRecipient']?.[0]?.['@_split']
	) {
		delete data['podcast:value'];
	}
}
