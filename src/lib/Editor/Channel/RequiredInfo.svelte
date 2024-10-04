<script>
	import Title from '$lib/Editor/Channel/Components/Title/Title.svelte';
	import Description from '$lib/Editor/Channel/Components/Description/Description.svelte';
	import Categories from '$lib/Editor/Channel/Components/Categories/Categories.svelte';
	import { rssData, tagHeaders } from '$/editor';
</script>

{#if $rssData}
	<Title />

	<Description />
	<label>
		<h3>{$tagHeaders.channel.link} (required)</h3>
		<input type="text" bind:value={$rssData.link} />
	</label>

	<Categories />

	<!-- <label class="locked">
		<input type="checkbox" bind:checked={locked} on:change={handleLock} />
		Podcast Locked
	</label> -->
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
