<script>
	import { rssData, tagHeaders } from '$/editor';
	import Locked from '$lib/Editor/Channel/Components/Locked/Locked.svelte';
	import Title from '$lib/Editor/Channel/Components/Title/Title.svelte';
	import Description from '$lib/Editor/Channel/Components/Description/Description.svelte';
	import Link from '$lib/Editor/Channel/Components/Link/Link.svelte';
	import Categories from '$lib/Editor/Channel/Components/Categories/Categories.svelte';
</script>

{#if $rssData}
	<Title />
	<Link />
	<Description />
	<Categories />
	<label>
		<h3>{$tagHeaders.channel.keywords}</h3>
		<input type="text" bind:value={$rssData['itunes:keywords']} />
	</label>

	<Locked />
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
