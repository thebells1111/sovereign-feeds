<script>
	import { editingEpisode, tagHeaders } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
</script>

<div class="episode-keywords">
	<label>
		<h3>{$tagHeaders.episodes.keywords}</h3>
		<input type="text" bind:value={$editingEpisode['itunes:keywords']} use:selectTextOnFocus />
	</label>
</div>

<style>
	.episode-keywords {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 4px;
	}
</style>
