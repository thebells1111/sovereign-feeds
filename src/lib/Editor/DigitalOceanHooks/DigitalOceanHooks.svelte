<script>
	import { podcastList, selectedPodcast, newEditorScreen, digitalOceanEnabled } from '$/editor';

	import { loggedIn } from '$/stores';

	import { onMount } from 'svelte';

	console.log($podcastList);

	export let showSaved = false;
	export let newFeed = false;

	let DO_BUCKET;
	let DO_ENDPOINT;
	let DO_ACCESS_KEY;
	let DO_SECRET_KEY;
	let DO_ENABLED = newFeed;
	let USE_FEED_KEYS = true;

	async function save() {
		let data = {
			DO_BUCKET: DO_BUCKET,
			DO_ENDPOINT: DO_ENDPOINT,
			title: USE_FEED_KEYS ? 'sfDOKeys' : $selectedPodcast.title,
			DO_ACCESS_KEY: DO_ACCESS_KEY,
			DO_SECRET_KEY: DO_SECRET_KEY,
			DO_ENABLED: DO_ENABLED,
			USE_FEED_KEYS: USE_FEED_KEYS
		};
		let res = await fetch('/api/database/webhook', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		let webhookData = await res.json();
		$digitalOceanEnabled = DO_ENABLED && DO_BUCKET && DO_ENDPOINT && DO_ACCESS_KEY && DO_SECRET_KEY;
		$newEditorScreen = 'typeSelect';
		showSaved = true;
		setTimeout(() => {
			showSaved = false;
		}, 500);
	}
	onMount(async () => {
		handleSelect($selectedPodcast);
	});

	function handleSelect(useMasterKeys) {
		fetch(
			`/api/database/webhook?title=${
				useMasterKeys ? 'sfDOKeys' : $selectedPodcast.title || 'sfDOKeys'
			}`
		).then((res) =>
			res.json().then((data) => {
				console.log(data);
				DO_BUCKET = data?.webhooks?.DO_BUCKET;
				DO_ENDPOINT = data?.webhooks?.DO_ENDPOINT;
				DO_ACCESS_KEY = data?.webhooks?.DO_ACCESS_KEY;
				DO_SECRET_KEY = data?.webhooks?.DO_SECRET_KEY;
				DO_ENABLED = data?.webhooks?.DO_ENABLED;
				if (data?.webhooks?.USE_FEED_KEYS !== 'undefined') {
					USE_FEED_KEYS = data?.webhooks?.USE_FEED_KEYS;
				} else {
					USE_FEED_KEYS = true;
				}
			})
		);
	}
</script>

<h2>Digital Ocean</h2>

{#if $loggedIn}
	<div class="input-container">
		<label class="enable">
			<input
				type="checkbox"
				checked={DO_ENABLED}
				on:change={(e) => (DO_ENABLED = e.target.checked)}
			/>Enable Digital Ocean
		</label>
		<label class="enable">
			<input
				type="checkbox"
				checked={USE_FEED_KEYS}
				on:change={(e) => {
					USE_FEED_KEYS = e.target.checked;
					handleSelect(USE_FEED_KEYS);
				}}
			/>Use Master Digital Ocean Keys
		</label>
		<label>Digital Ocean Spaces Bucket <input type="text" bind:value={DO_BUCKET} /></label>
		<label>Digital Ocean Spaces Endpoint<input type="text" bind:value={DO_ENDPOINT} /></label>
		<label>Digital Ocean Spaces Access Key<input type="text" bind:value={DO_ACCESS_KEY} /></label>
		<label>Digital Ocean Spaces Secret Key<input type="text" bind:value={DO_SECRET_KEY} /></label>
		<button class="primary" on:click={save}>Save</button>
	</div>
{:else}
	<h3>Sign In to Digital Ocean Integration</h3>
{/if}

<style>
	h2 {
		color: hsl(226, 82%, 30%);
		cursor: pointer;
	}

	.unclickable {
		cursor: default;
		margin: 0;
	}
	.input-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: calc(100% - 24px);
		margin-bottom: 8px;
		padding-bottom: 8px;
		overflow: hidden;
	}

	label {
		width: 100%;
		font-size: 1.1em;
		font-weight: 600;
		padding: 8px;
		color: hsla(352, 100%, 43.7%, 1);
	}

	.input-container input[type='text'] {
		width: 100%;
		margin-left: 8px;
	}

	button.primary {
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
	}

	.enable {
		cursor: pointer;
	}
	.enable > input {
		margin-right: 8px;
	}
</style>
