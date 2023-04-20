<script>
	import { selectedPodcast } from '$/editor';
	import { onMount } from 'svelte';

	let message = '';
	let waitMessage = '';
	let captchaTotal;
	let solution = '';
	let captchaAnswer;
	let reason = 'update';

	async function podPingServer() {
		waitMessage = 'Sending PodPing...';

		let url = `api/podping?url=${encodeURIComponent($selectedPodcast.url)}&reason=${reason}`;

		console.log(url);

		const res = await fetch(url);
		const data = await res.text();

		message = data;
		waitMessage = '';
		setTimeout(() => {
			message = '';
		}, 10000);
	}

	function handlePodPing() {
		if (Number(solution) === captchaTotal && $selectedPodcast?.url) {
			podPingServer();
		}
		if (!$selectedPodcast?.url) {
			message = 'No Podcast Selected';
			setTimeout(() => {
				message = '';
			}, 5000);
		}
		createCaptcha();
		captchaAnswer.blur();
		solution = '';
	}

	function handleInputEnter(e) {
		if (e.key === 'Enter') {
			handlePodPing();
		}
	}

	function createCaptcha() {
		let captchaNumbers = Array(3)
			.fill(1)
			.map((v) => Math.floor(Math.random() * 9 + 1));
		//random * max number displayed
		captchaTotal = captchaNumbers.reduce((acc, v) => acc + v);
		let captchaDisplay = [captchaNumbers[0], '+', captchaNumbers[1], '+', captchaNumbers[2], '='];
		displayArray(captchaDisplay);

		function displayArray(arr) {
			let canvas = document.getElementById('captcha');
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.font = '20px Georgia';
			for (var i = 0; i < arr.length; i++) {
				context.fillText(arr[i], i * 15, 15);
			}
		}
	}

	onMount(createCaptcha);
</script>

<h2>Podping</h2>
<h3>What type of ping do you want to send?</h3>
<div class="radio-container">
	<label>
		<input type="radio" bind:group={reason} name="reason" value="update" />
		Notify the Podcast Index your feed has been <span class="bold">updated</span>
	</label>

	<label>
		<input type="radio" bind:group={reason} name="reason" value="live" />
		Notify the podcast players your feed has gone <span class="bold">live</span>
	</label>

	<label>
		<input type="radio" bind:group={reason} name="reason" value="liveEnd" />
		Notify the podcast players your live feed has <span class="bold">ended</span>
	</label>
</div>

<p class="reminder">
	Your feed is the source of truth. <br /> This means Podping will notify the apps of your intention
	to go live, but the apps will always display what's in your feed.
	<br />So remember to update and upload the live status of your feed on your server first, then
	send a live podping update.
</p>

<p style="font-size: 1.1em; font-weight: 600">
	After uploading your feed to your server, solve the problem below, then press Enter
</p>

<div class="captcha-container" class:hide={waitMessage}>
	<canvas id="captcha" width="90" height="25" />
	<input
		bind:value={solution}
		on:keypress={handleInputEnter}
		bind:this={captchaAnswer}
		disable={message ? true : false}
	/>
</div>

{#if waitMessage}
	<p class="message">{waitMessage}</p>
{/if}

{#if message}
	<p class="message">{message}</p>
{/if}

<style>
	h2 {
		margin: 0;
		text-align: center;
		color: hsl(0, 100%, 33%);
	}
	p {
		text-align: center;
		padding: 8px;
		margin: 4px;
	}

	h3 {
		text-align: center;
	}

	.radio-container {
		padding: 0 calc((100% - 475px) / 2);
	}
	label {
		display: flex;
		padding: 8px;
		cursor: pointer;
		width: 446px;
	}

	.message {
		font-size: 1.1em;
		font-weight: 600;
		color: red;
	}

	input {
		width: 50px;
		height: 25px;
		margin: 0;
	}

	.captcha-container {
		display: flex;
		height: 25px;
		align-items: center;
		justify-content: center;
	}

	.reminder {
		color: hsl(0, 100%, 33%);
		font-weight: 550;
		margin-top: 16px;
	}

	.bold {
		color: hsl(212, 100%, 33%);
		font-weight: 600;
		font-size: 1.1em;
		position: relative;
		left: 4px;
		bottom: 2px;
	}

	.hide {
		display: none;
	}
</style>
