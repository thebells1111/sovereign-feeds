<script>
	import parser from 'fast-xml-parser';
	import pkg from 'file-saver';

	import cleanValue from '$lib/Tags/Value/cleanValue';
	const { saveAs } = pkg;

	import { onMount } from 'svelte';
	import RecepientEditor from './RecepientEditor.svelte';
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import Modal from '$lib/Modals/Modal/Modal.svelte';

	import { podcastList, showBuildingRSS } from '$/editor';
	let feeds = [];
	let uniqueAddresses = null;
	let filteredAddresses = [];
	let searchInput = '';
	let selectedFeed = null;
	let showModal = false;
	let selectedPerson;
	$: console.log(feeds);

	let js2xml = new parser.j2xParser({
		attributeNamePrefix: '@_',
		//attrNodeName: false,
		textNodeName: '#text',
		ignoreAttributes: false,
		ignoreNameSpace: false,
		format: true,
		indentBy: '  ',
		supressEmptyNode: true,
		attrValueProcessor: (val, attrName) => escapeAttr(`${val}`),
		tagValueProcessor: (val, tagName) => escapeTag(`${val}`)
	});

	const escapeAttr = (str) =>
		str.replace(
			/[&<>'"]/g,
			(tag) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					"'": '&#39;',
					'"': '&quot;'
				})[tag]
		);

	const escapeTag = (str) => {
		if (str.match(/[&<>'"]/g)) {
			return '<![CDATA[' + str + ']]>';
		}
		return str;
	};

	onMount(fetchAddresses);

	function fetchAddresses() {
		getAllAddresses($podcastList).then((list) => {
			uniqueAddresses = getUniqueObjects(list);
			filteredAddresses = uniqueAddresses;
			feeds = feeds;
		});
	}

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
						['@_name']: item['@_name'] || null,
						['@_address']: item['@_address'],
						['@_customValue']: item['@_customValue'] || null,
						['@_customKey']: item['@_customKey'] || null,
						['@_type']: item['@_type'] || null
					});
				}
			}
		});

		return Array.from(uniqueMap.values()).sort((a, b) => a['@_name'].localeCompare(b['@_name']));
	}

	function findPodcasts(address) {
		let podcasts = '';
		feeds.forEach((feed) => {
			if (
				feed.addresses.findIndex(
					(v) =>
						v['@_address'] === address['@_address'] &&
						v['@_customValue'] === address['@_customValue'] &&
						v['@_customKey'] === address['@_customKey']
				) > -1
			) {
				podcasts += `${feed.feed.title}, `;
			}
		});

		return podcasts.replace(/, $/, '');
	}

	function selectPerson(person) {
		selectedPerson = person;
		showModal = true;
	}

	function updatePerson(originalPerson, selectedPerson) {
		console.log(uniqueAddresses);

		selectedPerson.updated = true;
		uniqueAddresses = uniqueAddresses;
		filteredAddresses = filteredAddresses;

		feeds.forEach((feed) => {
			updateSingleAddress(feed?.feed, originalPerson, selectedPerson);
			let items = [].concat(feed?.feed?.item || []);
			items.forEach((item) => {
				updateSingleAddress(item, originalPerson, selectedPerson);
			});
		});

		showModal = false;
	}
	function updateSingleAddress(data, originalPerson, selectedPerson) {
		if (data?.['podcast:value']?.['podcast:valueRecipient']) {
			data['podcast:value']['podcast:valueRecipient'] = []
				.concat(data['podcast:value']['podcast:valueRecipient'])
				.map((v) => {
					if (
						v['@_address'] === originalPerson['@_address'] &&
						v?.['@_customValue'] == originalPerson['@_customValue'] &&
						v?.['@_customKey'] == originalPerson['@_customKey']
					) {
						v['@_name'] = selectedPerson['@_name'];
						v['@_address'] = selectedPerson['@_address'];
						v['@_type'] = selectedPerson['@_type'];
						if (selectedPerson?.['@_type'] === 'lnaddress') {
							delete v['@_customValue'];
							delete v['@_customKey'];
						} else if (selectedPerson?.['@_type'] === 'node') {
							v['@_customValue'] = selectedPerson['@_customValue'];
							v['@_customKey'] = selectedPerson['@_customKey'];
						}
					}
					return v;
				});
		}
	}

	function handleSelectFeed(event) {
		const selectedIndex = event.target.value;
		selectedFeed = feeds[selectedIndex] ? feeds[selectedIndex].feed : null;
		console.log(`Selected feed:`, selectedFeed);
	}

	async function publishFeed() {
		$showBuildingRSS = true;

		cleanValue(selectedFeed);
		if (selectedFeed?.item) {
			for (let item of [].concat(selectedFeed.item)) {
				cleanValue(item);
			}
		}

		let feed = { rss: {} };
		feed.rss.channel = selectedFeed;
		feed.rss['@_version'] = '2.0';
		feed.rss['@_xmlns:itunes'] = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
		feed.rss['@_xmlns:podcast'] =
			'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md';
		// initializeRSSData();

		let xmlFile = js2xml.parse(feed);
		if (!xmlFile) {
			$showBuildingRSS = false;
			return;
		}
		let date = new Date();
		let d = date.toLocaleString('en-US', { hour12: false });
		var blob = new Blob([xmlFile], { type: 'text/plain;charset=utf-8' });

		saveAs(
			blob,
			`${selectedFeed?.title} - ${d.replace(/\//g, '-').replace(',', '').replace(/:/g, '.')}.xml`
		);
		$showBuildingRSS = false;
	}

	function filterByName() {
		filteredAddresses = uniqueAddresses.filter(
			(item) => item['@_name'] && item['@_name'].toLowerCase().includes(searchInput.toLowerCase())
		);
	}
</script>

{#if uniqueAddresses}
	<div class="dropdown">
		<label for="dropdown-menu" class="dropdown-label">Publish a Feed:</label>
		<select id="dropdown-menu" class="dropdown-select" on:change={handleSelectFeed}>
			<option value="" disabled selected>Choose a feed</option>
			{#each feeds as { feed }, index}
				<option value={index}>{feed.title}</option>
			{/each}
		</select>
		{#if selectedFeed}
			<button class="primary" on:click={publishFeed}> Publish </button>
		{/if}
	</div>
	<h4>Update a person:</h4>
	<input type="text" placeholder="find person" bind:value={searchInput} on:input={filterByName} />
	<ul>
		{#each filteredAddresses as person}
			<li on:click={selectPerson.bind(this, person)}>
				<p class:strike={person.updated}>
					{person['@_name']} - {findPodcasts(person)}
				</p>
				{#if person.updated}
					<span>updated</span>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	Loading Recepients
{/if}

{#if showModal}
	<Modal bind:showModal>
		<RecepientEditor bind:selectedPerson {updatePerson} />
	</Modal>
{/if}

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

	li {
		margin: 4px 0;
		font-weight: 600;
		cursor: pointer;
		display: flex;
	}

	p {
		margin: 0;
		padding: 0;
	}

	.strike {
		text-decoration: line-through;
	}

	span {
		padding-left: 8px;
		color: red;
	}
</style>
