<script>
	export let data = {};
	export let index = 1;
	let provider = '';
	let username = '';
	let noUserFound = false;
	export let showProviderInput = false;

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
					info.customData[0]?.customValue,
					info.customData[0]?.customKey
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
					info.customData[0]?.customValue,
					info.customData[0]?.customKey
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

		// Only add customValue if it's not blank
		if (customValue) {
			recipient['@_customValue'] = customValue;
		}

		// Only add customKey if it's not blank
		if (customKey) {
			recipient['@_customKey'] = customKey;
		}
	}

	function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
	}
</script>

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
				<button class="provider fountain" on:click={handleProviderSelect.bind(this, 'Fountain')}>
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
			<h4>Node Address</h4>
			<input
				type="text"
				bind:value={data['podcast:valueRecipient'][index - 1]['@_address']}
				placeholder="Node Address"
			/>
		</label>

		<div class="split-top">
			<label class="split-label">
				<h4>{data['podcast:valueRecipient'][index - 1]['@_fee'] ? 'Percent' : 'Shares'}</h4>

				<input
					type="text"
					bind:value={data['podcast:valueRecipient'][index - 1]['@_split']}
					placeholder="whole numbers only"
				/>
			</label>
			<div class="fee">
				<h4>Fee</h4>
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
			{data['podcast:valueRecipient'][index - 1]['@_fee']
				? 'When fee is selected, the amount is a percent of the boost that is taken off the top before splitting amongst all the other splits. Use whole numbers only.'
				: "Shares are not percentages, they're shares of the total shares. Use whole numbers only."}
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

<style>
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

	.split-top {
		display: flex;
		justify-content: space-between;
	}

	.fee {
		display: flex;
		flex-direction: column;
		margin-left: 8px;
	}

	.fee-container {
		display: flex;
		padding: 8px;
	}

	.split-label {
		display: flex;
		flex-direction: column;
		width: 100%;
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
