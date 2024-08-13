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
	let showChannelImport = true;
	export let support = true;

	// Check if Sovereign Feeds is not added
	$: noSF = (() => {
		try {
			const valueRecipient = data?.['podcast:valueRecipient'];

			if (Array.isArray(valueRecipient)) {
				return (
					valueRecipient.findIndex(
						(v) =>
							v?.['@_address'] ===
							'035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8'
					) === -1
				);
			}
			return true;
		} catch (error) {
			console.error('Error:', error);
			return false;
		}
	})();

	$: {
		try {
			const valueRecipient = data?.['podcast:valueRecipient'];
			const valueRecipientLength = valueRecipient?.length;

			if (index > valueRecipientLength) {
				index = valueRecipientLength || 1;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	function addSovereignFeeds() {
		data['podcast:valueRecipient'].push({
			'@_name': 'Sovereign Feeds',
			'@_address': '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8',
			'@_type': 'node',
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
			noUserFound = true;
		}
	}

	async function handleFountainSubmit(name) {
		try {
			let res = await fetch(`https://fountain.fm/.well-known/keysend/${name}`);
			let info = await res.json();

			if (info.status === 'OK') {
				updateRecipientData(
					info.pubkey,
					name + '@fountain.fm',
					info.customData[0].customValue,
					info.customData[0].customKey
				);
				cancelProviderSubmit();
			} else {
				throw new Error();
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

	function updateRecipientData(address, name, customValue, customKey) {
		let recipient = data['podcast:valueRecipient'][index - 1];
		recipient['@_address'] = address;
		recipient['@_name'] = name;
		recipient['@_customValue'] = customValue;
		recipient['@_customKey'] = customKey;
	}

	function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
	}
</script>

<div class="persons-container">
	<div class="splits-container">
		{#if showChannelImport}
			CHannnel
		{/if}
		{#if noSF && support}
			<button class="primary support" on:click={addSovereignFeeds}>
				Support Sovereign Feeds! Add us to your Value Block!
			</button>
		{/if}
		<SplitsList bind:data bind:index bind:activeRecipient bind:showValues />
		<FeesList bind:data bind:index bind:activeRecipient bind:showValues />
	</div>

	<div class="value-input-container" class:show={showValues}>
		{#if data && data?.['podcast:valueRecipient']?.length > 0}
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
							<button class="provider v4vapp" on:click={handleProviderSelect.bind(this, 'v4v.app')}>
								<img src="v4vapp.webp" />
								<span>Use v4v.app</span>
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

	button.v4vapp {
		background-color: hsl(0, 0%, 0%);
		color: white;
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
