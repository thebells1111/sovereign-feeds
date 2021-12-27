<script>
	import LinkIcon from '$lib/icons/Link.svelte';
	export let chapter;
	export let small = false;
	let hidden = true;
</script>

<div
	class="img-container"
	on:click={() => (hidden = !hidden)}
	style={small ? 'height: 60px;	width: 60px;	min-width: 60px;' : ''}
>
	{#if chapter?.img}
		<img src={chapter?.img} />
	{:else}
		<p class="img-holder">Add Link to Image</p>
	{/if}
</div>

<style>
	.img-container {
		position: relative;
		height: 200px;
		width: 200px;
		min-width: 200px;
	}

	.img-container > img {
		width: 100%;
		-webkit-user-drag: none;
		user-select: none;
	}

	.img-holder {
		padding: 0;
		align-self: center;
		margin: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		border: 1px solid #333;
		text-align: center;
		cursor: pointer;
		font-size: 0.6em;
	}
</style>
