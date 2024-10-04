<script>
	import { rssData, selectedPodcast, podcastList, tagHeaders } from '$/editor';
</script>

<label>
	<h3>{$tagHeaders.channel.name} (required)</h3>
	<input
		type="text"
		bind:value={$rssData.title}
		on:input={() => {
			let i = $podcastList.findIndex(({ id }) => id === $selectedPodcast.id);
			$podcastList[i].title = $rssData.title;
			$podcastList = $podcastList;
		}}
	/>
</label>

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
