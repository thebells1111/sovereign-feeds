<script>
	import { editingEpisode } from '$/editor';
	import NumberInput from './NumberInput/NumberInput.svelte';

	function handleHourInput() {}
	function handleMinuteInput() {}
	$: console.log($editingEpisode);
</script>

{#if $editingEpisode?.['@_start']?.duration?.hour}
	<div class="duration">
		<h3>Estimated duration of live episode:</h3>
		<div class="time-select">
			<NumberInput
				max={99}
				min={0}
				bind:value={$editingEpisode['@_start'].duration.hour}
				blurDefault={0}
				handleInput={handleHourInput}
				disableScroll={true}
			/>
			<span>hours</span>
			<NumberInput
				max={59}
				min={0}
				bind:value={$editingEpisode['@_start'].duration.minute}
				blurDefault={0}
				handleInput={handleMinuteInput}
				disableScroll={true}
			/>
			<span>minutes</span>
		</div>
	</div>
{/if}

<style>
	.duration {
		margin-bottom: 8px;
	}
	.time-select {
		padding: 0 6px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
