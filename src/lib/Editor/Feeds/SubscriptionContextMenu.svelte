<script>
	import { podcastList, selectedPodcast, editorDB } from '$/editor';

	let contextMenu;
	let contextData;
	let showContextMenu = false;

	$: if (showContextMenu) {
		contextMenu && contextMenu.focus();
	}

	async function deletePodcast() {
		$podcastList.splice(contextData.index, 1);
		$podcastList = $podcastList;

		let fav = await editorDB.getItem('favorites');
		fav.splice(contextData.index, 1);
		editorDB.setItem('favorites', fav);
	}

	function handleContextMenu(e) {
		showContextMenu = false;
		let fileNode = e.target;
		console.log();
		while (!(fileNode.dataset && fileNode.dataset.id)) {
			fileNode = fileNode.parentElement;
			if (fileNode.nodeName === 'HTML') {
				break;
			}
		}

		if (fileNode.dataset.type === 'podcastList') {
			contextData = fileNode.dataset;
			e.preventDefault();
			let containerNode = fileNode.parentElement.parentElement;
			let containerBounds = containerNode.getBoundingClientRect();
			var x = e.clientX - containerBounds.left;
			var y = e.clientY - containerBounds.top;
			contextMenu.style.top = y + 'px';
			contextMenu.style.left = x + 'px';
			showContextMenu = true;
		}
	}
</script>

<svelte:window
	on:click={(e) => {
		showContextMenu = false;
	}}
	on:contextmenu={handleContextMenu}
/>

<nav
	class:show-menu={showContextMenu}
	bind:this={contextMenu}
	on:blur={() => (showContextMenu = false)}
>
	<ul>
		<li on:click={deletePodcast}>Remove From Favorites</li>
	</ul>
</nav>

<style>
	ul {
		padding: 0;
		margin: 0;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
	}
	li:first-of-type {
		border-bottom: 1px solid var(--border-color);
	}

	li {
		width: 100%;
		list-style-type: none;
		height: 60px;
		display: grid;
		place-content: center;
		padding: 0 8px 0 12px;
	}
	li:first-of-type {
		border-bottom: 1px solid var(--border-color);
	}

	li:hover {
		background-color: var(--text-color);
		color: var(--tertiary-color);
	}

	nav {
		position: absolute;
		display: none;
		top: 0;
		background: var(--tertiary-color);
		z-index: 99;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
	}
	.show-menu {
		display: block;
	}
</style>
