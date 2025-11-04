<script>
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import initializeValueTimeSplit from '$lib/Tags/ValueSplits/initializeValueTimeSplit';
	import SplitWallet from './SplitWallet.svelte';
	import { remoteServerUrl, editingEpisode } from '$/editor';

	let isImporting = false;

	let badStartBlocks = [];
	let badValueBlocks = [];
	let badDurationBlocks = [];

	let showProviderInput = false;
	let showImportModal = false;
	let liveValueLink;
	async function loadBlocks() {
		let guid = stripGUID(liveValueLink);
		let confirmation = false;

		confirmation = confirm(
			'Are you sure you want to import new value blocks? \nDoing so will overwrite these ones.'
		);

		if (confirmation) {
			const res = await fetch(remoteServerUrl + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			console.log(data);
			const settings = data.settings || {};
			const blocks = (data.blocks.slice(1) || []).filter((v) => v);
			console.log(blocks);
			let timeSplits = [];
			isImporting = true;
			showImportModal = false;
			if (blocks?.length) {
				badStartBlocks = blocks.filter((v) => !v?.startTime);
				badDurationBlocks = blocks.filter((v) => !v?.duration);
				badValueBlocks = blocks.filter((v) => !v?.value?.destinations?.length);

				blocks.forEach(async (v) => {
					if (
						!settings.includeDefault &&
						['podcast', 'edit', 'music'].find((v) => v === settings?.broadcastMode) &&
						v?.settings?.default
					) {
						badStartBlocks = badStartBlocks.filter((w) => w.blockGuid !== v.blockGuid);
						badDurationBlocks = badDurationBlocks.filter((w) => w.blockGuid !== v.blockGuid);
						badValueBlocks = badValueBlocks.filter((w) => w.blockGuid !== v.blockGuid);
					}
					if (v?.startTime > -1 && v?.duration) {
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
									'@_type': v.type,
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

						timeSplits = timeSplits.sort((a, b) => a['@_startTime'] - b['@_startTime']);

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
								'podcast:valueRecipient': []
							}
						]
					}
				};
				$editingEpisode.valueTimeSplit = await initializeValueTimeSplit(episode);
			}
			isImporting = false;
		}
	}

	const stripGUID = (str) => {
		const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
		const match = str.match(regex);
		if (match) {
			return match[0];
		}
		return null;
	};

	function addRecipient(ts) {
		ts['podcast:valueRecipient'] = ts?.['podcast:valueRecipient'] || [];

		ts['podcast:valueRecipient'] = ts['podcast:valueRecipient'].concat({
			'@_name': '',
			'@_split': '',
			'@_type': 'lnaddress',
			'@_address': '',
			'@_customValue': '',
			'@_customKey': ''
		});

		$editingEpisode = $editingEpisode;
	}

	async function addSplit() {
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
						'podcast:valueRecipient': []
					}
				]
			}
		};

		$editingEpisode.valueTimeSplit = $editingEpisode.valueTimeSplit.concat(
			await initializeValueTimeSplit(episode)
		);
	}

	function deleteSplit(index) {
		console.log(index);
		let confirmation = confirm('Are you sure you want to delete this split?');
		if (confirmation) {
			$editingEpisode.valueTimeSplit = $editingEpisode.valueTimeSplit.filter((v, i) => i !== index);
		}
	}
</script>

{#if isImporting}
	<h2 class="importing">Importing Splits</h2>
{:else}
	<select-container>
		<button class="primary add" on:click={addSplit}>Add New Split</button>

		<button
			class="primary"
			on:click={() => {
				showImportModal = true;
			}}>Import Value Time Splits <br />from The Split Kit</button
		>
	</select-container>
{/if}
<container>
	{#if badStartBlocks?.length}
		<h4>The following blocks don't have a start time. Fix this in The Split Kit.</h4>
		<ul>
			{#each badStartBlocks as block}
				<li>{block?.title}</li>
			{/each}
		</ul>
	{/if}
	{#if badValueBlocks?.length}
		<h4>The following blocks don't have a value block. Fix this in The Split Kit.</h4>
		<ul>
			{#each badValueBlocks as block}
				<li>{block?.title}</li>
			{/each}
		</ul>
	{/if}

	{#if badDurationBlocks?.length}
		<h4>The following blocks don't have a duration. Fix this in The Split Kit.</h4>
		<ul>
			{#each badDurationBlocks as block}
				<li>{block?.title}</li>
			{/each}
		</ul>
	{/if}

	{#if $editingEpisode?.valueTimeSplit?.length > 0}
		{#each $editingEpisode.valueTimeSplit as ts, tsindex}
			<remote-block>
				<title>
					<h3>
						{ts?.feed || 'Custom Value'}
						{ts?.item ? ` - ${ts.item}` : ''}
					</h3>
					<button class="primary delete" on:click={deleteSplit.bind(this, tsindex)}
						><span>Delete Split</span></button
					>
				</title>
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
				{#if ts?.['podcast:valueRecipient']?.length > 0}
					{#each ts['podcast:valueRecipient'] as vr, index}
						<SplitWallet bind:data={vr} {index} bind:ts {tsindex} bind:showProviderInput />
					{/each}
				{/if}
			</remote-block>
		{/each}
	{/if}
</container>

{#if showImportModal}
	<Modal bind:showModal={showImportModal}>
		<div class="split-kit-import">
			<label>
				<h4>Live Value Link</h4>
				<input
					bind:value={liveValueLink}
					placeholder={`Paste your Live Value Link from the Split Kit`}
				/>
			</label><button class="submit-provider primary" on:click={loadBlocks}>Submit</button>
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

	title {
		width: 100%;
		display: flex;
		justify-content: space-between;
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

	select-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	select-container button {
		font-size: 0.8em;
		width: initial;
		padding: 4px 8px;
		margin: 0 8px;
		height: 44px;
	}

	select-container button:nth-of-type(1) {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	select-container button:nth-of-type(2) {
		min-width: 165px;
	}

	h2.importing {
		color: red;
		text-align: center;
		height: 44px;
		margin: 0;
	}

	button.delete {
		align-items: center;
		justify-content: center;
		height: 32px;
		color: white;
		background-color: hsla(352, 100%, 26.7%, 1);
		font-size: 0.75em;
	}
	title > button.primary.delete {
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	button.add-rec {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	.split-kit-import {
		width: 450px;
		margin: 8px 8px 16px 8px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;
	}

	.split-kit-import label {
		margin-bottom: 8px;
	}
</style>
