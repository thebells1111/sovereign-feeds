<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import checkUser from '$functions/checkUser';
	import Header from '$lib/Header/Header.svelte';
	import Login from '$lib/Modals/Login/Login.svelte';
	import NewFeedEditor from '$lib/Modals/FeedEditorModal/NewEditorModal.svelte';

	import { user, showNewEditor, showBuildingRSS, licenses } from '$/editor';
	import { showLogin, showMobile } from '$/stores';
	import BuildingRss from '$lib/Modals/BuildingRSS/BuildingRSS.svelte';
	import { page } from '$app/stores';

	const token = $page.url.searchParams.get('token');

	onMount(async () => {
		getUser();
		// validateFeed()
		const mediaQueryHandler = (e) => {
			// Reset mobile state
			if (Math.max(window.innerHeight, window.innerWidth) < 900) {
				$showMobile = true;
			} else if (window.innerHeight < 500) {
				$showMobile = true;
			} else {
				$showMobile = false;
			}
		};
		navigator.serviceWorker &&
			navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
				// console.log('Excellent, registered with scope: ', registration.scope);
			});

		// let apps = await window.navigator.getInstalledRelatedApps();
		// console.log(apps);

		const widthListener = window.matchMedia(
			`(max-width: ${Math.min(window.innerHeight, window.innerWidth)}px)`
		);

		mediaQueryHandler(widthListener);

		try {
			// Chrome & Firefox
			widthListener.addEventListener('change', mediaQueryHandler);
		} catch (e1) {
			try {
				// Safari
				widthListener.addListener(mediaQueryHandler);
			} catch (e2) {
				console.error(e2);
			}
		}

		fetch('https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json')
			.then((res) => res.json())
			.then((data) => {
				$licenses = data.licenses
					.sort((a, b) => {
						return a.licenseId > b.licenseId ? 1 : -1;
					})
					.map((v) => {
						return {
							value: v.licenseId.toLowerCase(),
							label: v.licenseId.toLowerCase(),
							url: v?.reference?.toLowerCase()
						};
					});
			});
	});

	async function getUser() {
		$user = token ? {} : (await checkUser()) || {};
	}
</script>

<div>
	<Header />
	<main>
		<slot />
	</main>
</div>

{#if $showLogin}
	<Login />
{/if}

{#if $showNewEditor}
	<NewFeedEditor />
{/if}

{#if $showBuildingRSS}
	<BuildingRss />
{/if}

<style>
	div {
		width: 100%;
		height: 100%;
		padding: 8px;
		display: flex;
		flex-direction: column;
	}
	main {
		margin: 0;
		padding: 0;
		height: calc(100% - 37px);
		background-color: white;
		border-radius: 8px;
	}
</style>
