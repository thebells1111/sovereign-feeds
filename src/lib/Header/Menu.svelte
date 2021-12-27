<script>
	import { showLogin, loggedIn, serverUrl, satBalance, showMobile } from '$/stores';

	import { goto } from '$app/navigation';

	import { user } from '$/editor';

	async function signout() {
		let response = await fetch(serverUrl + `signout?` + new Date().getTime());
		if (response.status === 200) {
			if (!$showMobile) {
				goto('/');
			}
			$user = null;
			$satBalance = 0;
			$loggedIn = false;
		}
	}
</script>

<div>
	{#if !$showMobile}
		<a href="/">Editor</a>
	{/if}
	<a href="/chapters">Chapters</a>
	<a href="/webhooks">Webhook Settings</a>
	<a href="/changes">Change Log</a>
	{#if $loggedIn}
		<button on:click={signout}>Sign Out</button>
	{:else}
		<button on:click={() => ($showLogin = true)}>Sign In</button>
	{/if}
</div>

<style>
	div {
		background-color: white;
		position: absolute;
		top: 40px;
		right: 4px;
		list-style: none;
		width: 120px;
		box-shadow: 0px 3px 10px 0px rgb(50 50 50 / 50%);
		border-radius: 4px;
		z-index: 999;
		display: flex;
		flex-direction: column;
	}

	button {
		background-color: transparent;
		border: none;
	}
	a,
	button {
		padding: 12px 8px;
		cursor: pointer;
		font-family: 'Gideon Roman', cursive;
		font-size: 1.1em;
		font-weight: 700;
		text-align: right;
		text-decoration: none;
	}

	a:hover,
	button:hover {
		background-color: hsl(226, 82%, 30%);
		color: white;
	}
</style>
