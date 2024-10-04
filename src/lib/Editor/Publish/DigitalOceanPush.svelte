<script>
	import FeedUpload from '$lib/Upload/FeedUpload.svelte';

	let showUpload;
	let fileName = '';
</script>

<p>Click below to send your RSS feed to your Digital Ocean Account.</p>
<button
	class="primary"
	on:click={() => {
		showUpload = true;
	}}>Send File to Digital Ocean</button
>
{#if fileName}
	<input value={fileName} readonly />
{/if}

{#if showUpload}
	<FeedUpload bind:showUpload bind:fileName />
{/if}

<style>
	button.primary {
		width: 50%;
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
		margin: 0 25%;
	}

	p {
		text-align: center;
		padding: 0;
		margin-bottom: 4px;
	}

	input {
		width: 100%;
	}
</style>
