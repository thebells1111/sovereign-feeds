<script>
	import checkUser from '$functions/checkUser';
	import { fade } from 'svelte/transition';
	let card;
	let errorMsg = '';
	let successMsg = '';

	import { showLogin, loggedIn } from '$/stores';
	import { user } from '$/editor';

	let email = '';

	$: if ($showLogin) {
		clearSuccessMsg();
	}

	function clearSuccessMsg() {
		successMsg = '';
	}

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	async function sendEmail() {
		try {
			successMsg = "E-mail is on it's way!!!";
			listenForSignin();
			if (validateEmail(email)) {
				let data = { type: 'signin', email: email };
				let response = await fetch(window.location.origin + `/api/sendemail`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				if (response.status !== 200) {
					successMsg = 'Hmmm... a problem occurred when trying to send an email.';
				}
			} else {
				errorMsg = 'Invalid e-mail address. <br>Please enter a valid e-mail address.';
			}
		} catch (err) {
			console.log(err);
		}
	}

	function listenForSignin() {
		window.addEventListener('storage', async (event) => {
			if (event.key === 'validated') {
				window.localStorage.removeItem('validated');
				$loggedIn = true;
				$showLogin = false;
				$user = (await checkUser()) || {};
			}
		});
	}

	function handleKeypress(e) {
		if (e.key === 'Enter') {
			sendEmail();
		}
	}
</script>

{#if $showLogin}
	<section
		on:mousedown|self={() => {
			$showLogin = false;
		}}
		on:touchstart|self={() => {
			$showLogin = false;
		}}
		out:fade={{ duration: 500 }}
	>
		<div class="scroll-bar-clipper" bind:this={card}>
			<div class="copied-card">
				{#if !successMsg}
					<div class="input-container">
						<label
							>E-mail
							<input
								type="email"
								placeholder="you@email.com"
								bind:value={email}
								on:keypress={handleKeypress}
							/>
						</label>

						<button class="primary" on:click={sendEmail}>Submit</button>

						<p>{@html errorMsg}</p>
					</div>
				{:else}
					<h2>E-mail is on it's way!!!</h2>
					<h2>Please check your e-mail and follow the instructions to continue signing in.</h2>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.65);
		height: 100vh;
		width: 100vw;
		display: grid;
		place-items: center center;
		z-index: 9999;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 344px;
		height: 225px;
		border-radius: 4px;
		overflow: auto;
		z-index: 3;
	}

	.copied-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: white;
		height: 100%;
		width: 100%;
		border-radius: 4px;
		position: relative;
	}

	h2 {
		text-align: center;
	}

	.input-container {
		width: 100%;
		padding: 0 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	label {
		font-size: 1.1em;
		font-weight: 600;
		width: 100%;
	}

	input {
		width: 100%;
		margin: 8px 0;
	}

	p {
		margin: 0;
		padding: 0;
		height: 30px;
		width: 100%;
		text-align: center;
		color: red;
	}

	button {
		margin: 8px auto;
	}
</style>
