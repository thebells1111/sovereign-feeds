<script>
	import { editingEpisode } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';

	let options = ['live', 'pending', 'ended'];
</script>

<div class="episode-live-status">
	<h3>Live Status:</h3>
	<select bind:value={$editingEpisode['@_status']}>
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
</div>

<style>
	.episode-live-status {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	select {
		text-align: center;
		margin: 0 8px;
	}
</style>
