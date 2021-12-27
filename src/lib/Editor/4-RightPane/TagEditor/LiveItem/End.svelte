<script>
	import { editingEpisode } from '$/editor';
	import DateInput from './DatePicker/DateInput.svelte';
	import Time from './TimeBlocks/Time.svelte';
</script>

<div class="episode-author">
	<h3>End Time:</h3>
	<div class="time-select">
		<DateInput format="yyyy/MM/dd" bind:value={$editingEpisode['@_end'].dateTime} />
		<span class="spacer" />
		<Time type="end" bind:date={$editingEpisode['@_end']} />
	</div>
</div>

<style>
	.episode-author {
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.time-select {
		display: flex;
		align-items: center;
	}

	.spacer {
		width: 16px;
	}
</style>
