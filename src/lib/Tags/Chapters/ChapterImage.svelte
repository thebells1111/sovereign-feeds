<script>
	import LinkIcon from '$lib/icons/Link.svelte';
	export let chapter;
	let hidden = true;
</script>

<div class="image-link-container" class:hidden>
	<input type="url" class="image-link" bind:value={chapter.img} />
	<button on:click={() => (hidden = true)}>X</button>
</div>
<div class="img-container" on:click={() => (hidden = !hidden)}>
	{#if chapter.img}
		<img src={chapter.img} />
	{:else}
		<p class="img-holder">Click to Add Image URL</p>
	{/if}
	<div class="link-icon">
		<LinkIcon />
	</div>
</div>

<style>
	.img-container {
		position: relative;
	}

	.link-icon {
		position: absolute;
		background-color: white;
		width: 20px;
		height: 20px;
		display: grid;
		place-content: center;
		border-radius: 20px;
		right: 2px;
		bottom: 6px;
	}

	.image-link-container {
		display: block;
		position: absolute;
		left: 0;
		width: 100%;
		z-index: 2;
	}

	.image-link {
		position: relative;
		left: 24px;
		width: calc(100% - 24px);
		background-color: var(--tertiary-color);
	}
	.image-link-container > button {
		position: absolute;
		top: 8px;
		right: 4px;
		background-color: #333;
		color: white;
		padding: 0;
		height: 24px;
		width: 24px;
		border-radius: 20px;
		border: none;
		font-weight: 800;
	}

	.img-container > img {
		width: 100px;
		-webkit-user-drag: none;
		user-select: none;
	}

	.hidden {
		display: none;
	}

	.img-holder {
		padding: 0;
		align-self: center;
		width: 98px;
		height: 98px;
		display: grid;
		place-content: center;
		border: 1px solid #333;
		text-align: center;
		cursor: pointer;
	}
</style>
