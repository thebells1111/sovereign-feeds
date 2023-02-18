<script>
	import SplitsList from './SplitsList.svelte';
	import FeesList from './FeesList.svelte';
	import Cancel from '$lib/icons/Cancel.svelte';

	export let data = {};
	let index = 1;
	let activeRecipient = data['podcast:valueRecipient']?.[index - 1];
	let showValues = false;
	let provider = '';
	let username = '';
	let noUserFound = false;
	let showProviderInput = false;

	$: noSF =
		data?.['podcast:valueRecipient']?.findIndex(
			(v) => v?.['@_customValue'] === 'eChoVKtO1KujpAA5HCoB'
		) === -1;

	$: if (index > data?.['podcast:valueRecipient']?.length) {
		index = data['podcast:valueRecipient'].length || 1;
	}

	function addSovereignFeeds() {
		data['podcast:valueRecipient'].push({
			'@_name': 'Sovereign Feeds',
			'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			'@_type': 'node',
			'@_customKey': '696969',
			'@_customValue': 'eChoVKtO1KujpAA5HCoB',
			'@_fee': true,
			'@_split': 5
		});
		data = data;
		index = data['podcast:valueRecipient'].length;
	}

	async function handleProviderSelect(providerName) {
		showProviderInput = true;
		provider = providerName;
	}

	async function handleProviderSubmit() {
		noUserFound = false;
		let name = username.split('@');
		if (!name[0]) {
			name.shift();
		}
		console.log(name);
		if (provider === 'Alby') {
			let res = await fetch(`https://getalby.com/.well-known/keysend/${name[0]}`);
			let info;
			try {
				info = await res.json();
				if (info.status === 'OK') {
					data['podcast:valueRecipient'][index - 1]['@_name'] = name[0] + '@getalby.com';
					data['podcast:valueRecipient'][index - 1]['@_address'] = info.pubkey;
					data['podcast:valueRecipient'][index - 1]['@_customValue'] =
						info.customData[0].customValue;
					data['podcast:valueRecipient'][index - 1]['@_customKey'] = info.customData[0].customKey;
				} else {
					throw new Error();
				}
				cancelProviderSubmit();
			} catch (error) {
				noUserFound = true;
				info = undefined;
			}
		} else if (provider === 'Fountain') {
			let res = await fetch('https://api.fountain.fm/v1/content/lookup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: name[0] })
			});
			let info;

			try {
				info = await res.json();
				if (!info?.keysend?.customValue) {
					throw new Error();
				}
				if (info?.username) {
					data['podcast:valueRecipient'][index - 1]['@_name'] = info.keysend.name;
					data['podcast:valueRecipient'][index - 1]['@_address'] = info.keysend.address;
					data['podcast:valueRecipient'][index - 1]['@_customValue'] = info.keysend.customValue;
					data['podcast:valueRecipient'][index - 1]['@_customKey'] = info.keysend.customKey;
				}
				cancelProviderSubmit();
			} catch (error) {
				noUserFound = true;
				info = undefined;
			}
			console.log(info);
		}
	}

	async function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
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

	<div class="value-input-container" class:show={showValues}>
		{#if data && data['podcast:valueRecipient'].length > 0}
			<button
				class="cancel"
				on:click={() => {
					showValues = false;
					cancelProviderSubmit();
				}}
			>
				<Cancel size="30px" />
			</button>

			{#if showProviderInput}
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
			{:else}
				<div class="person-block">
					<label>
						<h4>
							Value Recipient Name
							<button class="provider alby" on:click={handleProviderSelect.bind(this, 'Alby')}>
								<img src="alby.png" />
								<span>Use Alby</span>
							</button>
							<button
								class="provider fountain"
								on:click={handleProviderSelect.bind(this, 'Fountain')}
							>
								<img src="fountain.png" />
								<span>Use Fountain</span>
							</button>
						</h4>
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
						for splits and fees, use whole numbers only <br />(99 would receive 99% of the split
						after fees are paid)
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
	.value-input-container {
		height: 450px;
		width: 60%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: auto;
		padding: 8px;
		border-radius: 4px;
		box-shadow: 0px 3px 10px 0px rgb(50 50 50 / 50%);
		margin: 8px;
		position: absolute;
		background-color: white;
		opacity: 0;
		top: 8px;
		right: -60%;
		transition: opacity 0.5s, right 0.5s;
	}

	.value-blocks-container {
		width: 100%;
	}

	.show {
		opacity: 1;
		right: 0;
		transition: opacity 0s, right 0.5s;
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
		width: 100%;
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

	button > img {
		height: 30px;
	}

	button.alby > img {
		height: 28px;
		padding-left: 4px;
	}

	button.alby > span {
		width: 100%;
	}

	.wallet-provider {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.wallet-provider input {
		width: 400px;
	}

	.wallet-provider-button-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wallet-provider-button-container button {
		margin: 8px;
		width: 140px;
		font-weight: 600;
		border-radius: 20px;
	}

	.cancel-provider {
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	.wallet-provider p {
		position: absolute;
		bottom: -32px;
		width: 100%;
		font-size: 20px;
		text-align: center;
		color: red;
		font-weight: 600;
	}
</style>
