<script>
	import { editingEpisode, tagHeaders } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
</script>

<div class="episode-author">
	<label>
		<h3>{$tagHeaders.episodes.author}</h3>
		<input
			type="text"
			bind:value={$editingEpisode.author}
			on:input={() => {
				$editingEpisode['itunes:author'] = $editingEpisode.author;
			}}
			use:selectTextOnFocus
		/>
	</label>
</div>

<style>
	.episode-author {
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
