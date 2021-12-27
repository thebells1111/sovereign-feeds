<script>
	import { podcastList, selectedPodcast } from '$/editor';

	import { onMount } from 'svelte';
	console.log($podcastList);

	let chapterLink;
	let chapterSecret;
	let webhookLink;
	let webhookSecret;
	export let showSaved = false;

	async function save() {
		let data = {
			webhookLink: webhookLink,
			webhookSecret: webhookSecret,
			title: $selectedPodcast.title,
			chapterLink: chapterLink,
			chapterSecret: chapterSecret
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
		showSaved = true;
		setTimeout(() => {
			showSaved = false;
		}, 500);
	}
	onMount(async () => {
		handleSelect($selectedPodcast);
	});

	function handleSelect() {
		fetch(`/api/database/webhook?title=${$selectedPodcast.title}`).then((res) =>
			res.json().then((data) => {
				console.log(data);
				webhookLink = data?.webhooks?.webhookLink;
				webhookSecret = data?.webhooks?.webhookSecret;
				chapterLink = data?.webhooks?.chapterLink;
				chapterSecret = data?.webhooks?.chapterSecret;
			})
		);
	}

	let expand = false;
</script>

<h2
	on:click={() => {
		expand = !expand;
	}}
>
	Webhooks <div class="arrow" class:up={expand}>▼</div>
</h2>
<div class="input-container" class:expand>
	<label>Webhook Link <input type="text" bind:value={webhookLink} /></label>
	<label>Webhook Secret <input type="text" bind:value={webhookSecret} /></label>
	<label>Chapter Link <input type="text" bind:value={chapterLink} /></label>
	<label>Chapter Secret <input type="text" bind:value={chapterSecret} /></label>
	<button class="primary" on:click={save}>Save</button>
</div>

<style>
	h2 {
		color: hsl(226, 82%, 30%);
		cursor: pointer;
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

	.input-container input {
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
		height: 383px;
		transition: height 0.3s;
	}

	.arrow {
		display: inline-block;
		position: relative;
		top: 2px;
	}
</style>
