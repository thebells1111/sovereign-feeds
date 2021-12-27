<script>
	import { rssData, tagHeaders } from '$/editor';
</script>

<label>
	<h3>{$tagHeaders.podcast.description} (required)</h3>
	<textarea type="text" bind:value={$rssData.description} />
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	textarea {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
