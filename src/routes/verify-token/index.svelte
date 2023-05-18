<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { loggedIn } from '$/stores';
	import { remoteServerUrl, user } from '$/editor';
	import checkUser from '$functions/checkUser';
	const token = $page.url.searchParams.get('token');
	let isLoggingIn = true;

	onMount(async () => {
		let res = await fetch(remoteServerUrl + '/api/sf/verify-token?token=' + token, {
			credentials: 'include'
		});
		let data = await res.json();
		isLoggingIn = false;

		if (data.status === 'success') {
			$loggedIn = true;
			$user = token ? {} : (await checkUser()) || {};
			// goto('/');
		}
	});
</script>

{#if isLoggingIn}
	<p>Verifying Log In</p>
{:else if !$loggedIn}
	<p>Log In Denied. Please try again</p>
{:else}
	<p>Logged In</p>
	<a href="/">Click Here to Continue</a>
{/if}
