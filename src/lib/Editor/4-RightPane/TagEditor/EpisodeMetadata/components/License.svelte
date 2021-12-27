<script>
	import { editingEpisode } from '$/editor';
</script>

<h3>License</h3>

<label class="license">
	<h4>License Type (required)</h4>
	<input type="text" bind:value={$editingEpisode['podcast:license']['#text']} />
</label>
<label class="license-url">
	<h4>Link to License Type Explanation (optional)</h4>
	<input type="text" bind:value={$editingEpisode['podcast:license']['@_url']} />
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	label input {
		flex-grow: 1;
		padding: 8px;
	}

	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	h4 {
		margin: 0 0 0 4px;
	}
</style>
