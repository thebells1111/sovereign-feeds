<script>
	import SplitsList from './SplitsList.svelte';
	import FeesList from './FeesList.svelte';
	import Cancel from '$lib/icons/Cancel.svelte';

	export let data = {};
	let index = 1;
	let activeRecipient = data['podcast:valueRecipient']?.[index - 1];
	let showValues = false;

	$: noSF =
		data?.['podcast:valueRecipient']?.findIndex(
			(v) => v?.['@_customValue'] === 'wal_MB9T45QHGyW'
		) === -1;

	$: if (index > data?.['podcast:valueRecipient']?.length) {
		index = data['podcast:valueRecipient'].length || 1;
	}

	function addSovereignFeeds() {
		data['podcast:valueRecipient'].push({
			'@_name': 'Sovereign Feeds',
			'@_address': '02a128c92baf0ede00ed0fc3720a92ba2c6392e0b58aa4decab1d787a666d94cb73',
			'@_type': 'node',
			'@_customKey': '',
			'@_customValue': 'wal_MB9T45QHGyW',
			'@_fee': true,
			'@_split': 5
		});
		data = data;
		index = data['podcast:valueRecipient'].length;
	}
</script>

<div class="persons-container">
	<div class="splits-container">
		{#if noSF}
			<button class="primary support" on:click={addSovereignFeeds}>
				Support Sovereign Feeds! Add us to your Value Block!
			</button>
		{/if}
		<SplitsList bind:data bind:index bind:activeRecipient bind:showValues />
		<FeesList bind:data bind:index bind:activeRecipient bind:showValues />
	</div>

	<div class="value-blocks-container" class:show={showValues}>
		{#if data && data['podcast:valueRecipient'].length > 0}
			<div class="person-block">
				<button
					class="cancel"
					on:click={() => {
						showValues = false;
					}}
				>
					<Cancel size="30px" />
				</button>
				<label>
					<h4>Value Recipient Name</h4>
					<input
						type="text"
						bind:value={data['podcast:valueRecipient'][index - 1]['@_name']}
						placeholder="Choose a name so people can send Boostagrams"
					/>
				</label>
				<label>
					<h4>Lightning Network Address</h4>
					<input
						type="text"
						bind:value={data['podcast:valueRecipient'][index - 1]['@_address']}
						placeholder="Lightning Network Address"
					/>
				</label>

				<div class="split-top">
					<label class="split-label">
						<h4>Split</h4>

						<input
							type="text"
							bind:value={data['podcast:valueRecipient'][index - 1]['@_split']}
							placeholder="whole numbers only"
						/>
					</label>
					<div class="fee">
						<h4>Fee:</h4>
						<div class="fee-container">
							<label>
								<input
									type="radio"
									bind:group={data['podcast:valueRecipient'][index - 1]['@_fee']}
									value={false}
								/>
								No
							</label>

							<label>
								<input
									type="radio"
									bind:group={data['podcast:valueRecipient'][index - 1]['@_fee']}
									value={true}
								/>
								Yes
							</label>
						</div>
					</div>
				</div>
				<p>
					for splits and fees, use whole numbers only <br />(99 would receive 99% of the split after
					fees are paid)
				</p>

				<label>
					<h4>Custom Key</h4>
					<input
						type="text"
						bind:value={data['podcast:valueRecipient'][index - 1]['@_customKey']}
						placeholder="(optional) Leave blank unless required by your wallet"
					/>
				</label>
				<label>
					<h4>Custom Value</h4>
					<input
						type="text"
						bind:value={data['podcast:valueRecipient'][index - 1]['@_customValue']}
						placeholder="(optional) Leave blank unless required by your wallet"
					/>
				</label>
			</div>
		{/if}
	</div>
</div>

<style>
	.persons-container {
		display: flex;
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.splits-container {
		height: 100%;
		width: 100%;
		overflow: auto;
	}
	.value-blocks-container {
		overflow: auto;
		padding: 8px;
		border-radius: 4px;
		box-shadow: 0px 3px 10px 0px rgb(50 50 50 / 50%);
		margin: 8px;
		width: calc(100% - 16px);
		position: absolute;
		background-color: white;
		opacity: 0;
		bottom: -391px;
		transition: opacity 0.5s, bottom 0.5s;
	}

	.show {
		bottom: 8px;
		opacity: 1;
		transition: opacity 0s, bottom 0.5s;
	}

	.cancel {
		color: red;
		position: absolute;
		right: 0;
		top: 0;
		padding: 4px 4px 0 4px;
		margin: 0;
		background-color: transparent;
		border: none;
	}
	.person-block {
		margin: 8px 0 16px 0;
	}
	p {
		margin: 0;
		padding: 0;
	}
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 43.7%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.split-top + p {
		text-align: left;
		margin: 0;
		padding: 0 0 0 8px;
		font-size: 0.9em;
		font-style: italic;
		text-align: center;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	button.primary {
		width: 80%;
		margin-left: 10%;
		margin-top: 8px;
	}
	button.primary.self {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	.split-top {
		display: flex;
		justify-content: space-between;
	}

	.fee {
		display: flex;
	}

	.fee-container {
		display: flex;
		padding-left: 8px;
		padding-right: 8px;
	}

	.split-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.split-label > input {
		margin: 0 8px;
		width: 48px;
	}

	.fee-container > label {
		padding-right: 8px;
		margin-right: 12px;
		cursor: pointer;
		display: block;
		width: 48px;
	}
</style>
