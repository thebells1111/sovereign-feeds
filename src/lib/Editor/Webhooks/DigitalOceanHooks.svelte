<script>
	import { selectedPodcast, newEditorScreen, digitalOceanEnabled, remoteServerUrl } from '$/editor';

	export let showArrow = true;
	export let showSaved = false;
	export let webHooks;

	async function save() {
		let res = await fetch(remoteServerUrl + '/api/sf/webhook?title=' + $selectedPodcast.title, {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(webHooks)
		});
		let webhooks = await res.json();
		$digitalOceanEnabled =
			webHooks.DO_ENABLED &&
			webHooks.DO_BUCKET &&
			webHooks.DO_ENDPOINT &&
			webHooks.DO_ACCESS_KEY &&
			webHooks.DO_SECRET_KEY;
		$newEditorScreen = 'typeSelect';
		showSaved = true;
		setTimeout(() => {
			showSaved = false;
		}, 500);
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
			checked={webHooks.DO_ENABLED}
			on:change={(e) => (webHooks.DO_ENABLED = e.target.checked)}
		/>Enable Digital Ocean
	</label>
	<label>Digital Ocean Spaces Bucket <input type="text" bind:value={webHooks.DO_BUCKET} /></label>
	<label>Digital Ocean Spaces Endpoint<input type="text" bind:value={webHooks.DO_ENDPOINT} /></label
	>
	<label
		>Digital Ocean Spaces Access Key<input type="text" bind:value={webHooks.DO_ACCESS_KEY} /></label
	>
	<label
		>Digital Ocean Spaces Secret Key<input type="text" bind:value={webHooks.DO_SECRET_KEY} /></label
	>
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
