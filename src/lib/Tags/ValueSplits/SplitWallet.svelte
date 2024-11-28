<script>
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import { onMount } from 'svelte';
	import { editingEpisode } from '$/editor';
	export let data = {};
	export let ts = {
		feed: '',
		item: '',
		'@_feedGuid': '',
		'@_itemGuid': '',
		'@_startTime': '',
		'@_duration': '',
		'@_remotePercentage': '',
		'podcast:valueRecipient': []
	};
	export let index = 1;
	export let tsindex = 1;
	export let showProviderInput = false;

	let activeRecipient;
	let provider = '';
	let username = '';
	let noUserFound = false;

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
					info.customData[0]?.customValue,
					info.customData[0]?.customKey
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

		if (customValue) {
			activeRecipient['@_customValue'] = customValue;
		}

		if (customKey) {
			activeRecipient['@_customKey'] = customKey;
		}

		$editingEpisode = $editingEpisode;

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
		let lnRadio = document.querySelector(`input[name=vts-wallet-type-${index}][value="lnaddress"]`);
		lnRadio.checked = true;
		lnRadio.dispatchEvent(new Event('change', { bubbles: true })); // Trigger the change event
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

	let walletType = 'lnaddress';

	function changeWallet(e) {
		console.log(e.target.value);
		data['@_type'] = e.target.value;
	}

	onMount(handleNewWalletType);

	function handleNewWalletType() {
		let lnRadio;
		if (data['@_type'] === 'node') {
			lnRadio = document.querySelector(`input[name=vts-wallet-type-${index}][value="node"]`);
		} else {
			lnRadio = document.querySelector(`input[name=vts-wallet-type-${index}][value="lnaddress"]`);
		}
		lnRadio.checked = true;
		lnRadio.dispatchEvent(new Event('change', { bubbles: true })); // Trigger the change event
	}
</script>

<div class="type-select">
	<h4>Wallet Type:</h4>
	<label>
		<input type="radio" value="node" name={`vts-wallet-type-${index}`} on:change={changeWallet} />
		node
	</label>
	<label>
		<input
			type="radio"
			value="lnaddress"
			name={`vts-wallet-type-${index}`}
			on:change={changeWallet}
		/>
		lnaddress
	</label>
</div>
<value-top>
	<label>
		<h4>Name</h4>
		<input bind:value={data['@_name']} />
	</label>
	<label>
		<h4>Split</h4>
		<input bind:value={data['@_split']} />
	</label>
</value-top>
<label>
	<h4>Lightning Address</h4>
	<input bind:value={data['@_address']} />
</label>

{#if data['@_type'] === 'node'}
	<value-bottom>
		<label>
			<h4>Custom Value</h4>
			<input bind:value={data['@_customValue']} />
		</label>
		<label>
			<h4>Custom Key</h4>
			<input bind:value={data['@_customKey']} />
		</label>
	</value-bottom>
{/if}
<providers>
	{#if data['@_type'] === 'node'}
		<button
			class="provider alby"
			on:click={handleProviderSelect.bind(this, 'Alby', tsindex, index)}
		>
			<img src="alby.png" />
			<span>Use Alby</span>
		</button>
		<button class="provider fountain" on:click={handleProviderSelect.bind(this, 'Fountain', data)}>
			<img src="fountain.png" />
			<span>Use Fountain</span>
		</button>
		<button class="provider v4vapp" on:click={handleProviderSelect.bind(this, 'v4v.app', data)}>
			<img src="v4vapp.webp" />
			<span>Use v4v.app</span>
		</button>
	{:else}
		<spacer></spacer>
	{/if}
	<button class="provider delete" on:click={deleteAddress.bind(this, ts, index)}>
		<span>Delete <br /> Recpient</span>
	</button>
</providers>

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
	h4 {
		margin: 0;
	}

	label {
		width: 100%;
	}

	input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	value-top {
		display: flex;
	}

	value-bottom {
		display: flex;
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
		font-size: 0.75em;
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

	.type-select {
		display: flex;
		width: 100%;
	}

	.type-select > label {
		margin: 0 16px 0 0;
		cursor: pointer;
		width: initial;
		display: flex;
	}
	spacer {
		display: block;
		width: 450px;
	}
</style>
