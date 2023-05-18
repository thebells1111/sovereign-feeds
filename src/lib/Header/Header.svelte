<script>
	import { showLogin, loggedIn, serverUrl, showMobile } from '$/stores';

	import { remoteServerUrl } from '$/editor';

	import { goto } from '$app/navigation';

	import { user } from '$/editor';

	let showMenu = false;

	async function signout() {
		let response = await fetch(remoteServerUrl + `/api/sf/signout?` + new Date().getTime(), {
			credentials: 'include'
		});
		if (response.status === 200) {
			goto('/');
			$user = null;
			$loggedIn = false;
		}
	}
</script>

<header>
	<a href={$showMobile ? '/chapters' : '/'} class="title">Sovereign Feeds</a>
	{#if !$showMobile}
		<a href="/">Editor</a>
		<a href="/chapters">Chapters</a>
		<a href="/tutorials">Tutorials</a>
	{/if}
	{#if $loggedIn}
		<button on:click={signout}>Sign Out</button>
	{:else}
		<button on:click={() => ($showLogin = true)}>Sign In</button>
	{/if}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 8px;
		position: relative;
	}

	a {
		color: white;
		text-decoration: none;
		font-family: 'Gideon Roman', cursive;
		font-size: 1.1em;
		font-weight: 700;
	}

	header > .title {
		font-size: 1.5em;
	}

	button {
		font-family: 'Gideon Roman', cursive;
		font-size: 1.1em;
		font-weight: 700;
		color: white;
		background-color: transparent;
		border: none;
		outline: none;
		padding: 0 8px;
		margin: 0;
	}

	#hamburger-menu {
		padding: 0 8px;
		margin: 0;
		height: 29px;
		color: white;
		background-color: transparent;
	}
</style>
