<script>
	import { podcastList, editorDB, selectedPodcast } from '$/editor';
	import { loggedIn } from '$/stores';
	import Select from 'svelte-select';

	import { onMount } from 'svelte';
	console.log($podcastList);

	let chapterLink;
	let chapterSecret;
	let webhookLink;
	let webhookSecret;
	let showSaved = false;

	onMount(async () => {
		if (!$podcastList.length) {
			$podcastList = (await editorDB.getItem('favorites')) || [];
		}
	});

	function handleSelect(event) {
		console.log('selected item', event.detail);
		$selectedPodcast = event.detail;
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
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="selected-podcast">
	Selected Podcast
	<div class="selector">
		<Select
			items={$podcastList}
			placeholder={'Select a Podcast'}
			on:select={handleSelect}
			labelIdentifier="title"
		/>
	</div>
</label>
<div class="webhook-container">
	{#if $loggedIn}
		{#if $selectedPodcast.title}
			<div class="input-container">
				<label>Webhook Link <input type="text" bind:value={webhookLink} /></label>
				<label>Webhook Secret <input type="text" bind:value={webhookSecret} /></label>
				<label>Chapter Link <input type="text" bind:value={chapterLink} /></label>
				<label>Chapter Secret <input type="text" bind:value={chapterSecret} /></label>
				<button class="primary" on:click={save}>Save Webhooks</button>
			</div>

			<div class="explainer">
				<h2>
					This feature is still Beta. If you choose to use it, thanks for being an early adopter,
					and please let me know any issues you may have.
				</h2>
				<p>
					By providing a Webhook Link and Secret, you can develop an API on your self-hosted server
					that can receive the XML file Sovereign Feeds generates. This will allow you to upload
					your RSS feed directly from Sovereign Feeds to your server.
				</p>

				<p class="reduced-padding">
					The Webhook Link is a link to your server that will handle receiving a POST of the XML
					file.
				</p>
				<p class="indent">
					For example, <span class="example">{`https:yourserver.com/api/rssgenerator`}</span>
				</p>

				<p class="reduced-padding">
					The Webhook Secret is a an authorization token that will be included in the request header
					when sending the XML file to your server. This allows you to block any request that
					doesn't include the token and allow any request that does include the token.
				</p>
				<p class="indent">
					<span class="example">{`authorization: 'Bearer <webhook Secret>'`}</span>
					will be included in each request header from Sovereign Feeds if you include a Webhook Secret.
				</p>

				<p>
					It is highly recommended your server is a HTTPS server to ensure your Webhook Secret is
					encrypted when sending requests to your server.
				</p>
				<p>
					The idea behind this is you can use Sovereign Feeds to create your RSS feed, then publish
					the RSS feed to your server without having to download the XML file, followed by uploading
					the file to your server. You can write a server function to update the existing RSS feed
					with the new RSS feed sent to your server, as well as creating an archive of the RSS feed
					for backup.
				</p>
				<p>
					With the Webhook Secret, the idea is anyone who has the secret has permission to edit the
					RSS file on your server. This has the potential for someone to hijack your RSS feed, so be
					careful with who you share the secret with.
				</p>
			</div>
		{/if}
	{:else}
		<h3>Sign In to Add Web Hooks</h3>
	{/if}
</div>

<div class="modal" class:show={showSaved}>
	<div class="container">
		<h1>Saved!</h1>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		width: calc(100% + 8px);
		height: calc(100% + 48px);
		left: -8px;
		top: -48px;
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.show {
		display: flex;
	}

	.container {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}

	.webhook-container {
		background-color: white;
		padding: 8px;
		margin-bottom: 8px;
	}

	h1 {
		margin: 0;
		color: hsl(226, 82%, 30%);
	}

	.input-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: calc(100% - 24px);
		margin-bottom: 8px;
	}

	label {
		width: 100%;
		font-size: 1.1em;
		font-weight: 600;
		padding: 8px;
		color: hsla(352, 100%, 43.7%, 1);
	}

	label.selected-podcast {
		width: calc(100% - 24px);
		padding-left: 8px;
		padding-bottom: 0;
	}
	.input-container input {
		width: 100%;
		margin-left: 8px;
	}

	.selector {
		width: 100%;
		margin-left: 8px;
		font-size: 0.9em;
		font-weight: 550;
		padding: 8px;
		color: black;
	}

	.explainer {
		padding: 8px 16px 8px 0;
	}
	p {
		font-weight: 550;
	}

	.reduced-padding {
		padding-bottom: 4px;
	}

	.indent {
		padding: 0 0 16px 32px;
	}

	.example {
		color: hsla(352, 100%, 43.7%, 1);
	}

	button.primary {
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
	}
</style>
