<script>
	import Select from 'svelte-select';
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import initializeValueTimeSplit from './initializeValueTimeSplit';
	import { remoteServerUrl, editingEpisode, liveEpisodes } from '$/editor';

	let guidOptions = [];
	let selectedGuid;

	let isImporting = false;

	let badStartBlocks = [];
	let badValueBlocks = [];
	let badDurationBlocks = [];

	let provider = '';
	let username = '';
	let noUserFound = false;
	let showProviderInput = false;
	let activeRecipient;

	$: getGuids($liveEpisodes);

	function getGuids() {
		$liveEpisodes.forEach((v) => {
			let tempGuid = v?.['podcast:liveValue']?.['@_uri'];

			if (tempGuid) {
				if (!guidOptions.find((w) => w.value === tempGuid)) {
					guidOptions.push({ label: v.title, value: tempGuid });
				}
			}
		});
		guidOptions = guidOptions;
		selectedGuid = guidOptions?.[0]?.value;
		console.log(guidOptions);
		console.log(selectedGuid);
	}

	async function loadBlocks() {
		console.log(selectedGuid);
		let guid = selectedGuid?.split('?event_id=');
		let confirmation = false;
		if (guid?.[0] !== 'https://curiohoster.com/event') {
			alert(
				`This only works with CurioHoster events. 
\nPlease use the Split Kit to create your own event`
			);
		} else {
			confirmation = confirm(
				'Are you sure you want to import new value blocks? \nDoing so will overwrite these ones.'
			);
		}

		if (confirmation) {
			const res = await fetch(remoteServerUrl + '/api/sk/getblocks?guid=' + guid[1]);
			const data = await res.json();
			console.log(data);
			const settings = data.settings || {};
			const blocks = data.blocks || [];
			let timeSplits = [];
			isImporting = true;
			if (blocks?.length) {
				badStartBlocks = blocks.filter((v) => !v.startTime);
				badDurationBlocks = blocks.filter((v) => !v.duration);
				badValueBlocks = blocks.filter((v) => !v?.value?.destinations?.length);

				blocks.forEach(async (v) => {
					if (
						!settings.includeDefault &&
						['podcast', 'edit', 'music'].find((v) => v === settings?.broadcastMode) &&
						v.settings.default
					) {
						badStartBlocks = badStartBlocks.filter((w) => w.blockGuid !== v.blockGuid);
						badDurationBlocks = badDurationBlocks.filter((w) => w.blockGuid !== v.blockGuid);
						badValueBlocks = badValueBlocks.filter((w) => w.blockGuid !== v.blockGuid);
					}
					if (v.startTime > -1 && v.duration) {
						if (
							!settings.includeDefault &&
							['podcast', 'edit', 'music'].find((v) => v === settings?.broadcastMode) &&
							v.settings.default
						) {
							return;
						}
						let vts = {
							'@_startTime': v.startTime,
							'@_remotePercentage': v?.settings?.split || 100,
							'@_duration': v.duration
						};

						if (v.feedGuid) {
							vts['podcast:remoteItem'] = { '@_feedGuid': v.feedGuid };
							if (v.itemGuid) {
								vts['podcast:remoteItem']['@_itemGuid'] = v.itemGuid;
							}
						} else if (v?.value?.destinations?.length) {
							vts['podcast:valueRecipient'] = [].concat(v.value.destinations).map((v) => {
								return {
									'@_name': v.name,
									'@_split': v.split,
									'@_type': 'node',
									'@_address': v.address,
									'@_customValue': v.customValue,
									'@_customKey': v.customKey
								};
							});
						} else {
							vts = null;
						}

						if (vts) {
							timeSplits.push(vts);
						}

						let episode = { 'podcast:value': { 'podcast:valueTimeSplit': timeSplits } };
						$editingEpisode.valueTimeSplit = await initializeValueTimeSplit(episode);
					}
				});

				let episode = { 'podcast:value': { 'podcast:valueTimeSplit': timeSplits } };
				$editingEpisode.valueTimeSplit = await initializeValueTimeSplit(episode);
			} else {
				let episode = {
					'podcast:value': {
						'podcast:valueTimeSplit': [
							{
								feed: '',
								item: '',
								'@_feedGuid': '',
								'@_itemGuid': '',
								'@_startTime': '',
								'@_duration': '',
								'@_remotePercentage': '',
								valueRecipient: [
									{
										'@_name': '',
										'@_address': '',
										'@_type': 'node',
										'@_customKey': '',
										'@_customValue': '',
										'@_split': ''
									}
								]
							}
						]
					}
				};
				$editingEpisode.valueTimeSplit = await initializeValueTimeSplit(episode);
			}
			isImporting = false;
		}
	}

	function handleSelect(event) {
		let slug = event.detail || [];
		console.log(slug);
		selectedGuid = slug.value;
	}

	function handleClear(event) {
		selectedGuid = '';
	}

	async function handleProviderSelect(providerName, tsindex, index) {
		showProviderInput = true;
		provider = providerName;
		username = '';
		activeRecipient = $editingEpisode.valueTimeSplit[tsindex]['podcast:valueRecipient'][index];

		$editingEpisode = $editingEpisode;
	}

	async function handleProviderSubmit() {
		noUserFound = false;
		let name = username.split('@');
		if (!name[0]) {
			name.shift();
		}

		const providers = {
			Alby: handleAlbySubmit,
			Fountain: handleFountainSubmit,
			'v4v.app': handleV4vAppSubmit
		};

		if (providers.hasOwnProperty(provider)) {
			await providers[provider](name[0]);
		}
	}

	async function handleAlbySubmit(name) {
		try {
			let res = await fetch(`https://getalby.com/.well-known/keysend/${name}`);
			let info = await res.json();

			if (info.status === 'OK') {
				updateRecipientData(
					info.pubkey,
					name + '@getalby.com',
					info.customData[0].customValue,
					info.customData[0].customKey
				);
				cancelProviderSubmit();
			} else {
				throw new Error();
			}
		} catch (error) {
			console.log(error);
			noUserFound = true;
		}
	}

	async function handleFountainSubmit(name) {
		try {
			let res = await fetch('https://api.fountain.fm/v1/content/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: name })
			});
			let info = await res.json();

			if (!info?.keysend?.customValue) {
				throw new Error();
			}

			if (info?.username) {
				updateRecipientData(
					info.keysend.address,
					info.keysend.name,
					info.keysend.customValue,
					info.keysend.customKey
				);
				cancelProviderSubmit();
			}
		} catch (error) {
			noUserFound = true;
		}
	}

	async function handleV4vAppSubmit(name) {
		if (name) {
			updateRecipientData(
				'0266ad2656c7a19a219d37e82b280046660f4d7f3ae0c00b64a1629de4ea567668',
				name,
				name,
				818818
			);
			cancelProviderSubmit();
		} else {
			noUserFound = true;
		}
	}

	async function updateRecipientData(address, name, customValue, customKey) {
		console.log($editingEpisode.valueTimeSplit);
		console.log(activeRecipient);
		activeRecipient['@_address'] = address;
		activeRecipient['@_name'] = name;
		activeRecipient['@_customValue'] = customValue;
		activeRecipient['@_customKey'] = customKey;
		console.log(activeRecipient);
		activeRecipient = activeRecipient;
		$editingEpisode = $editingEpisode;
		console.log($editingEpisode);
		await delay(10000);
		$editingEpisode.valueTimeSplit = $editingEpisode.valueTimeSplit;
		$editingEpisode = $editingEpisode;

		await delay(5000);
		console.log('delayed');

		function delay(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
	}

	function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
	}

	function addRecipient(ts) {
		ts['podcast:valueRecipient'] = ts['podcast:valueRecipient'] || [];

		ts['podcast:valueRecipient'] = ts['podcast:valueRecipient'].concat({
			'@_name': '',
			'@_split': '',
			'@_type': 'node',
			'@_address': '',
			'@_customValue': '',
			'@_customKey': ''
		});

		console.log(ts['podcast:valueRecipient']);

		$editingEpisode = $editingEpisode;
	}

	function deleteAddress(ts, index) {
		let confirmation = confirm('Are you sure you want to delete this recipient?');

		if (confirmation) {
			ts['podcast:valueRecipient'] = ts['podcast:valueRecipient'].filter((v, i) => i !== index);
			if (ts['podcast:valueRecipient']?.length === 0) {
				addRecipient(ts);
			} else {
				$editingEpisode = $editingEpisode;
			}
		}
	}
</script>

{#if isImporting}
	<h2 class="importing">Importing Splits</h2>
{:else}
	<select-container>
		<select-component>
			<Select
				items={guidOptions}
				value={selectedGuid}
				on:select={handleSelect}
				on:clear={handleClear}
				isCreatable={true}
			/>
		</select-component>

		<button class="primary" on:click={loadBlocks} disable={!selectedGuid}
			>Import Value Time Splits <br />from The Split Kit</button
		>
	</select-container>
{/if}
<container>
	{#if badStartBlocks?.length}
		<h4>The following blocks don't have a start time. Fix this in The Split Kit.</h4>
		<ul>
			{#each badStartBlocks as block}
				<li>{block.title}</li>
			{/each}
		</ul>
	{/if}
	{#if badValueBlocks?.length}
		<h4>The following blocks don't have a value block. Fix this in The Split Kit.</h4>
		<ul>
			{#each badValueBlocks as block}
				<li>{block.title}</li>
			{/each}
		</ul>
	{/if}

	{#if badDurationBlocks?.length}
		<h4>The following blocks don't have a duration. Fix this in The Split Kit.</h4>
		<ul>
			{#each badDurationBlocks as block}
				<li>{block.title}</li>
			{/each}
		</ul>
	{/if}

	{#if $editingEpisode?.valueTimeSplit?.length > 0}
		{#each $editingEpisode.valueTimeSplit as ts, tsindex}
			<remote-block>
				<h3>
					{ts.feed || 'Custom Value'}
					{ts.item ? ` - ${ts.item}` : ''}
				</h3>
				<guids>
					<label>
						<h4>Feed Guid</h4>
						<input bind:value={ts['@_feedGuid']} />
					</label>
					<label>
						<h4>Item Guid</h4>
						<input bind:value={ts['@_itemGuid']} />
					</label>
				</guids>
				<misc>
					<label>
						<h4>Remote Split Percentage</h4>
						<input bind:value={ts['@_remotePercentage']} />
					</label>
					<label>
						<h4>Start Time</h4>
						<input bind:value={ts['@_startTime']} />
					</label>
					<label>
						<h4>Duration</h4>
						<input bind:value={ts['@_duration']} />
					</label>
				</misc>

				<value-header>
					<h3>Value Addresses</h3>
					<button class="primary add-rec" on:click={addRecipient.bind(this, ts)}
						>Add Recipient</button
					>
				</value-header>
				{#if ts['podcast:valueRecipient']?.length > 0}
					{#each ts['podcast:valueRecipient'] as vr, index}
						<value-top>
							<label>
								<h4>Name</h4>
								<input bind:value={vr['@_name']} />
							</label>
							<label>
								<h4>Split</h4>
								<input bind:value={vr['@_split']} />
							</label>
						</value-top>
						<label>
							<h4>Lightning Address</h4>
							<input bind:value={vr['@_address']} />
						</label>

						<value-bottom>
							<label>
								<h4>Custom Value</h4>
								<input bind:value={vr['@_customValue']} />
							</label>
							<label>
								<h4>Custom Key</h4>
								<input bind:value={vr['@_customKey']} />
							</label>
						</value-bottom>
						<providers>
							<button
								class="provider alby"
								on:click={handleProviderSelect.bind(this, 'Alby', tsindex, index)}
							>
								<img src="alby.png" />
								<span>Use Alby</span>
							</button>
							<button
								class="provider fountain"
								on:click={handleProviderSelect.bind(this, 'Fountain', vr)}
							>
								<img src="fountain.png" />
								<span>Use Fountain</span>
							</button>
							<button
								class="provider v4vapp"
								on:click={handleProviderSelect.bind(this, 'v4v.app', vr)}
							>
								<img src="v4vapp.webp" />
								<span>Use v4v.app</span>
							</button>
							<button class="provider delete" on:click={deleteAddress.bind(this, ts, index)}>
								<span>Delete</span>
							</button>
						</providers>
					{/each}
				{/if}
			</remote-block>
		{/each}
	{/if}
</container>

{#if showProviderInput}
	<Modal bind:showModal={showProviderInput}>
		<div class="wallet-provider">
			<input bind:value={username} placeholder={`Enter Your ${provider} User Name`} />
			<div class="wallet-provider-button-container">
				<button class="submit-provider primary" on:click={handleProviderSubmit}>Submit</button>
				<button class="cancel-provider primary" on:click={cancelProviderSubmit}>Cancel</button>
			</div>
			{#if noUserFound}
				<p>That username doesn't exist.</p>
			{/if}
		</div>
	</Modal>
{/if}

<style>
	container {
		display: block;
		padding-bottom: 8px;
	}
	remote-block {
		display: block;
		width: calc(100% - 16px);
		padding: 8px;
		margin: 8px 8px 16px 4px;
		box-shadow: 0 2px 8px #000000bf;
		border-radius: 8px;
		border: 1px solid transparent;
	}

	h3 {
		color: red;
		margin: 0;
		width: 100%;
	}
	h4 {
		margin: 0;
	}

	guids {
		display: flex;
	}

	value-header {
		display: flex;
		margin: 8px 0 0 0;
	}

	value-header h3 {
		width: 200px;
	}

	label {
		width: 100%;
	}

	input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	misc {
		display: flex;
	}

	value-top {
		display: flex;
	}

	value-bottom {
		display: flex;
	}

	select-container {
		display: flex;
		align-items: center;
	}

	select-component {
		flex: 1;
	}

	select-container button {
		font-size: 0.8em;
		width: initial;
		padding: 4px 8px;
		margin: 0 8px;
		height: initial;
	}

	h2.importing {
		color: red;
		text-align: center;
		height: 44px;
		margin: 0;
	}

	.wallet-provider {
		margin: 16px 32px 32px 32px;
		height: 120px;
	}

	.wallet-provider input {
		margin-bottom: 8px;
	}

	button.provider {
		margin: 0 0 8px 8px;
		width: 140px;
		font-weight: 600;
		border-radius: 20px;
		padding: 0;
		display: inline-flex;
		padding: 0 4px;
		align-items: center;
	}

	button.alby {
		background-color: hsl(41, 92%, 65%);
	}

	button.fountain {
		background-color: hsl(225, 7%, 11%);
		color: white;
	}

	button.v4vapp {
		background-color: hsl(0, 0%, 0%);
		color: white;
	}

	button.delete {
		align-items: center;
		justify-content: center;
		height: 32px;
		color: white;
		background-color: hsla(352, 100%, 26.7%, 1);
	}

	button > img {
		height: 30px;
	}

	button.v4vapp > img {
		padding: 0 6px 0 0;
	}

	button.alby > img {
		height: 28px;
		padding-left: 4px;
	}

	button.alby > span {
		width: 100%;
	}

	button.add-rec {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	button.cancel-provider {
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	providers {
		margin: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
