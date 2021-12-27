<script context="module">
	export const prerender = true;
</script>

<script>
	import { page } from '$app/stores';

	const token = $page.url.searchParams.get('token');

	import MusicEditor from '$lib/Editor/MusicEditor.svelte';
	import CreateEpisode from '$lib/Modals/CreateEpisode/CreateEpisode.svelte';
	import Saved from '$lib/Modals/Saved/Saved.svelte';
	import ServerSending from '$lib/Modals/ServerSending/ServerSending.svelte';

	import { showCreateEpisode, showMobile, serverUrl, loggedIn } from '$/stores';
	import { showSaved, editorDB, podcastList, showServerSending, selectedPodcast } from '$/editor';

	if (token) {
		verifyToken(token);
	}

	async function verifyToken(token) {
		history.pushState(null, null, '/');
		try {
			let response = await fetch(serverUrl + `verify-token?token=` + token, {
				credentials: 'include'
			});
			if (response.status === 200) {
				let data = await response.json();
				console.log(data);
				if (data.status === 'success') {
					loggedIn.set(true);
				}
				return data.user;
			} else {
				return {};
			}
		} catch (err) {
			console.log(err);
		}
	}

	function checkSave(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					event.preventDefault();
					console.log($selectedPodcast);
					$showSaved = true;
					editorDB.setItem('favorites', $podcastList);
					break;
			}
		}
	}

	$: console.log('sm: ', $showMobile);
</script>

<svelte:window on:keydown={checkSave} />

<MusicEditor />

{#if $showCreateEpisode}
	<CreateEpisode />
{/if}

{#if $showSaved}
	<Saved />
{/if}

{#if $showServerSending}
	<ServerSending />
{/if}
