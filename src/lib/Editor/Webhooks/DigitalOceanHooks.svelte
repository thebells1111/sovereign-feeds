<script>
	import { podcastList, selectedPodcast, newEditorScreen, digitalOceanEnabled } from '$/editor';

	import { onMount } from 'svelte';

	export let showArrow = true;
	export let showSaved = false;

	let DO_BUCKET;
	let DO_ENDPOINT;
	let DO_ACCESS_KEY;
	let DO_SECRET_KEY;
	let DO_ENABLED = !showArrow;

	async function save() {
		let data = {
			DO_BUCKET: DO_BUCKET,
			DO_ENDPOINT: DO_ENDPOINT,
			title: $selectedPodcast.title,
			DO_ACCESS_KEY: DO_ACCESS_KEY,
			DO_SECRET_KEY: DO_SECRET_KEY,
			DO_ENABLED: DO_ENABLED
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
		if (showArrow) {
			handleSelect($selectedPodcast);
		}
	});

	function handleSelect() {
		if ($selectedPodcast.title) {
			fetch(`/api/database/webhook?title=${$selectedPodcast.title}`).then((res) =>
				res.json().then((data) => {
					console.log(data);
					DO_BUCKET = data?.webhooks?.DO_BUCKET;
					DO_ENDPOINT = data?.webhooks?.DO_ENDPOINT;
					DO_ACCESS_KEY = data?.webhooks?.DO_ACCESS_KEY;
					DO_SECRET_KEY = data?.webhooks?.DO_SECRET_KEY;
					DO_ENABLED = data?.webhooks?.DO_ENABLED;
				})
			);
		}
	}

	let expand = !showArrow;
</script>

<h2
	on:click={() => {
		expand = showArrow ? !expand : true;
	}}
	class:unclickable={!showArrow}
>
	Digital Ocean
	{#if showArrow}
		<div class="arrow" class:up={expand}>▼</div>
	{/if}
</h2>
<div class="input-container" class:expand>
	<label class="enable">
		<input
			type="checkbox"
			checked={DO_ENABLED}
			on:change={(e) => (DO_ENABLED = e.target.checked)}
		/>Enable Digital Ocean
	</label>
	<label>Digital Ocean Spaces Bucket <input type="text" bind:value={DO_BUCKET} /></label>
	<label>Digital Ocean Spaces Endpoint<input type="text" bind:value={DO_ENDPOINT} /></label>
	<label>Digital Ocean Spaces Access Key<input type="text" bind:value={DO_ACCESS_KEY} /></label>
	<label>Digital Ocean Spaces Secret Key<input type="text" bind:value={DO_SECRET_KEY} /></label>
	<button class="primary" on:click={save}>Save</button>
</div>

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
		height: 0px;
		overflow: hidden;
		transition: height 0.3s;
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

	.up {
		transform: rotate(180deg);
	}

	.expand {
		height: 450px;
		transition: height 0.3s;
	}

	.arrow {
		display: inline-block;
		position: relative;
		top: 2px;
	}

	.enable {
		cursor: pointer;
	}
	.enable > input {
		margin-right: 8px;
	}
</style>
