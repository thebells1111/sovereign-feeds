<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { loggedIn } from '$/stores';
	import { remoteServerUrl } from '$/editor';
	const token = $page.url.searchParams.get('token');

	onMount(async () => {
		let res = await fetch(remoteServerUrl + '/api/sf/verify-token?token=' + token, {
			credentials: 'include'
		});
		let data = await res.json();
		if (data.status === 'success') {
			$loggedIn = true;
			// goto('/');
		}
	});

	let text = 'Verifying Log In';
</script>

{#if !loggedIn}
	{text}
{:else}
	<p>Logged In</p>
	<a href="/">Click Here to Continue</a>
{/if}
