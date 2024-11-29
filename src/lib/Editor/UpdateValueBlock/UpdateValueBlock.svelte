<script>
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import { podcastList } from '$/editor';
	let feeds = [];
	let uniqueAddresses = [];
	let selectedFeed = null;
	$: console.log(feeds);

	getAllAddresses($podcastList).then((list) => {
		console.log(list);
		console.log(feeds);

		uniqueAddresses = getUniqueObjects(list);
		console.log(uniqueAddresses);
		feeds = feeds;
	});

	async function getAllAddresses(list) {
		let allAddresses = [];
		for (let i = 0; i < list.length; i++) {
			let feed = await getRSSEditorFeed(list[i].url);
			let addresses = getPodcastAddresses(feed.rss.channel);
			feeds.push({ feed: feed.rss.channel, addresses: getUniqueObjects(addresses) });
			allAddresses = allAddresses.concat(addresses);
		}
		return allAddresses;
	}

	function getPodcastAddresses(data) {
		let addresses = [].concat(data?.['podcast:value']?.['podcast:valueRecipient']);

		[].concat(data?.item)?.forEach((v) => {
			addresses = addresses.concat(v?.['podcast:value']?.['podcast:valueRecipient']);
		});

		return addresses;
	}

	function getUniqueObjects(array) {
		const uniqueMap = new Map();

		array.forEach((item) => {
			if (item?.['@_address']) {
				const compositeKey = `${item['@_address']}-${item['@_customValue'] || ''}-${item['@_customKey'] || ''}`;
				if (!uniqueMap.has(compositeKey)) {
					uniqueMap.set(compositeKey, {
						name: item['@_name'] || null,
						address: item['@_address'],
						customValue: item['@_customValue'] || null,
						customKey: item['@_customKey'] || null
					});
				}
			}
		});

		return Array.from(uniqueMap.values());
	}

	function findPodcasts(address) {
		console.log(address);
		let podcasts = '';
		feeds.forEach((feed) => {
			console.log(feed);
			if (
				feed.addresses.findIndex(
					(v) =>
						v.address === address.address &&
						v.customValue === address.customValue &&
						v.customKey === address.customKey
				) > -1
			) {
				console.log('found');
				console.log(address.address);
				podcasts += `${feed.feed.title}, `;
			}
		});
		return podcasts;
	}

	function updateAddresses(address) {
		feeds.forEach((feed) => {
			console.log(feed.feed);
			console.log(feed?.feed?.['podcast:value']?.['podcast:valueRecipient']);
			if (feed?.feed?.['podcast:value']?.['podcast:valueRecipient']) {
				feed.feed['podcast:value']['podcast:valueRecipient'] = feed.feed['podcast:value'][
					'podcast:valueRecipient'
				].map((v) => {
					console.log(
						v['@_address'] === address.address &&
							v?.['@_customValue'] == address.customValue &&
							v?.['@_customKey'] == address.customKey
					);
					if (
						v['@_address'] === address.address &&
						v?.['@_customValue'] == address.customValue &&
						v?.['@_customKey'] == address.customKey
					) {
						v['@_address'] = 'dude@dude.com';
						delete v['@_customValue'];
						delete v['@_customKey'];
					}
					return v;
				});
			}
		});
		console.log(feeds);
	}

	const handleSelectFeed = (event) => {
		const selectedIndex = event.target.value;
		selectedFeed = feeds[selectedIndex] ? feeds[selectedIndex].feed : null;
		console.log(`Selected feed:`, selectedFeed);
	};
</script>

<div class="dropdown">
	<label for="dropdown-menu" class="dropdown-label">Publish a Feed:</label>
	<select id="dropdown-menu" class="dropdown-select" on:change={handleSelectFeed}>
		<option value="" disabled selected>Choose a feed</option>
		{#each feeds as { feed }, index}
			<option value={index}>{feed.title}</option>
		{/each}
	</select>
	{#if selectedFeed}
		<button class="primary"> Publish </button>
	{/if}
</div>
<ul>
	{#each uniqueAddresses as address}
		<li on:click={updateAddresses.bind(this, address)}>
			{address['name']} - {findPodcasts(address)}
		</li>
	{/each}
</ul>

<style>
	.dropdown {
		display: inline-block;
		font-family: Arial, sans-serif;
	}

	.dropdown-label {
		margin-right: 8px;
		font-weight: bold;
	}

	.dropdown-select {
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: white;
		cursor: pointer;
	}

	.dropdown-feedback {
		margin-top: 8px;
		font-style: italic;
		color: #555;
	}
</style>
