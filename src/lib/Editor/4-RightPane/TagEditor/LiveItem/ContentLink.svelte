<script>
	import { editingEpisode } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
</script>

<div class="content-link">
	<h3>Content Link:</h3>
	<p>alternate site to listen live if player doesn't support Live</p>
	<div class="input-container">
		<label>
			<h4>User Message:</h4>
			<input
				type="text"
				bind:value={$editingEpisode['podcast:contentLink']['#text']}
				use:selectTextOnFocus
				placeholder="Listen Live Here"
			/>
		</label>
		<h4>URL:</h4>
		<label>
			<input
				type="text"
				bind:value={$editingEpisode['podcast:contentLink']['@_href']}
				use:selectTextOnFocus
			/>
		</label>
	</div>
</div>

<style>
	.content-link {
		margin-bottom: 8px;
	}
	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
		margin-left: 4px;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 8px;
	}
	.input-container {
		margin: 0 0 0 8px;
	}
</style>
