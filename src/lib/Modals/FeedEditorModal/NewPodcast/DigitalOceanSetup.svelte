<script>
	import DigitalOceanHooks from '$lib/Editor/Webhooks/DigitalOceanHooks.svelte';
	import { rssData, podcastList, selectedPodcast } from '$/editor';
	let name = 'New Podcast';
</script>

<div>
	<h2 class="unclickable">Pick a podcast or album name:</h2>
	<input
		type="text"
		bind:value={name}
		on:input={(e) => {
			let i = $podcastList.findIndex(({ id }) => id === $selectedPodcast.id);
			$rssData.title = e.target.value;
			$podcastList[i].title = $rssData.title;
			$podcastList = $podcastList;
		}}
	/>
	{#if name === 'New Podcast'}
		<h2 class="warning">
			IMPORTANT<br />Your Digital Ocean Keys are saved to a folder based on your podcast or album
			name. <br />Please change your podcast name to something besides New Podcast
		</h2>
	{:else}
		<DigitalOceanHooks showArrow={false} />
	{/if}
</div>

<style>
	div {
		margin-left: 16px;
	}

	h2 {
		color: hsl(226, 82%, 30%);
		margin: 0;
	}

	.warning {
		margin: 16px 16px 32px 16px;
		text-align: center;
	}

	input[type='text'] {
		width: calc(100% - 16px);
		margin: 8px 0;
	}
</style>
