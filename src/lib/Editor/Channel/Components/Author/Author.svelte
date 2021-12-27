<script>
	import { rssData, tagHeaders } from '$/editor';
</script>

<label>
	<h3>{$tagHeaders.podcast.author}</h3>
	<input type="text" bind:value={$rssData['itunes:author']} />
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
