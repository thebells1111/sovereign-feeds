<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loggedIn } from '$/stores';
	const token = $page.url.searchParams.get('token');

	onMount(async () => {
		let resp = await fetch('https://curiohoster.com/api/verify-token?token=' + token, {
			credentials: 'include'
		});
		let rd = await resp.json();
		let res = await fetch('/api/verify-token?token=' + token);
		let data = await res.json();
		if (data.status === 'success') {
			$loggedIn = true;
			// goto('/');
		}
	});

	let text = 'Verifying Log In';
</script>

{text}
