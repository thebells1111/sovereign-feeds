<script>
	import { slide } from 'svelte/transition';

	import SettingsIcon from '$lib/icons/Settings.svelte';

	import { podcastList, selectedPodcast, editorDB } from '$/editor';

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'episodes-settings-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	async function deletePodcast() {
		const listIndex = $podcastList.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);

		$podcastList.splice(listIndex, 1);

		$podcastList = $podcastList;

		let fav = await editorDB.getItem('favorites');
		const favIndex = fav.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);
		fav.splice(favIndex, 1);
		editorDB.setItem('favorites', fav);
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div>
	<button id="episodes-settings-button" aria-label="Episode Settings" on:click={handleSettingsClick}
		><SettingsIcon size="27px" color="#333" /></button
	>
	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li on:click={deletePodcast}>Remove From Favorites</li>
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 30px;
	}
	ul {
		background-color: var(--tertiary-color);
		color: var(--text-color);
		border-radius: 3px;
		width: 200px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 36px;
		right: 4px;
		overflow: hidden;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		z-index: 3;
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 4px;
		line-height: 42px;
	}
	li:hover {
		background-color: var(--text-color);
		color: var(--tertiary-color);
	}

	button {
		background-color: transparent;
		margin: 0;
		padding: 0.25em;
		border: none;
		color: var(--text-color);
	}
</style>
