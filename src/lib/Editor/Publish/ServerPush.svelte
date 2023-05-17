<script>
	import buildRSS from './buildrss';
	import {
		webhookLink,
		webhookSecret,
		showServerSending,
		showServerSendingErrorMsg,
		selectedPodcast,
		podpingMessage,
		remoteServerUrl
	} from '$/editor';
	async function handleWebhook() {
		$podpingMessage = '';
		$showServerSending = true;
		try {
			let { title, xmlFile } = await buildRSS();

			if (title) {
				let res = await fetch(remoteServerUrl + '/api/sf/serverpush', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ xml: xmlFile, title: $selectedPodcast.title }),
					credentials: 'include'
				});
				if (res.status !== 200) {
					throw `Server Response Code ${res.status}`;
				}
				try {
					let data = await res.json();
					console.log(data);
					$showServerSendingErrorMsg = data.message || 'Feed Submitted Successfully';

					if (data.podping) {
						podPingServer(data.public_url || $selectedPodcast.url);
					}
				} catch (error) {
					throw 'Improper JSON response';
				}
			}
		} catch (error) {
			console.log(error);
			if (error === 'Improper JSON response') {
				$showServerSendingErrorMsg = 'Improper JSON response from Server';
			} else if (typeof error === 'string' && error?.includes('Server Response Code')) {
				let code = error?.split('Server Response Code ')?.[1];
				$showServerSendingErrorMsg = `Response Code ${code} received from Server`;
			} else {
				$showServerSendingErrorMsg = `Unknown Error sending to Server<br/><br/>Check your Webhook Link and Secret`;
			}
		}
	}

	async function podPingServer(feedUrl) {
		if (feedUrl) {
			let url = `/api/podping?url=${encodeURIComponent(feedUrl)}`;
			const res = await fetch(url);
			console.log(res);
			const data = await res.text();
			console.log(data);
			$podpingMessage = data;
		}
	}
</script>

<p>
	If you've setup your webhooks, and have a server API ready to recieve the XML file, <br />click
	below to send your RSS feed to your server.
</p>
<button class="primary" on:click={handleWebhook}>Send File to Server</button>

<style>
	button.primary {
		width: 50%;
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
		margin: 0 25%;
	}

	p {
		text-align: center;
		padding: 0;
		margin-bottom: 4px;
	}
</style>
