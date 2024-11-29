<script>
	import { rssData } from '$/editor';
	import clone from 'just-clone';

	$: console.log($rssData);

	let addresses = [];
	let uniqueAddresses = [];

	[]
		.concat($rssData?.['podcast:value']?.['podcast:valueRecipient'])
		.forEach((v) => (addresses = addresses.concat(v)));

	$rssData?.item?.forEach((v) => {
		addresses = addresses.concat(v?.['podcast:value']?.['podcast:valueRecipient']);
	});

	console.log(addresses);

	uniqueAddresses = getUniqueObjects(addresses);
	console.log(uniqueAddresses);

	function getUniqueObjects(array) {
		const uniqueMap = new Map();

		array.forEach((item) => {
			const compositeKey = `${item['@_address']}-${item['@_customValue'] || ''}-${item['@_customKey'] || ''}`;
			if (!uniqueMap.has(compositeKey)) {
				uniqueMap.set(compositeKey, {
					name: item['@_name'] || null,
					address: item['@_address'],
					customValue: item['@_customValue'] || null,
					customKey: item['@_customKey'] || null
				});
			}
		});

		return Array.from(uniqueMap.values());
	}
</script>
