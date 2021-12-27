<script>
	import { editingEpisode } from '$/editor';
	import DateInput from './DatePicker/DateInput.svelte';

	import Time from './TimeBlocks/Time.svelte';

	function setTime() {
		let d = new Date();
		let h = d.getHours();
		$editingEpisode['@_start'].meridian = h > 11 ? true : false;
		if (h > 12) {
			h -= 12;
		} else if (h === 0) {
			h = 12;
		}
		$editingEpisode['@_start'].hour = h;
		$editingEpisode['@_start'].minute = d.getMinutes();

		$editingEpisode['@_start'].dateTime = d.toDateString();
	}
</script>

<div class="live-start">
	<div class="header">
		<h3>Start Time:</h3>
		<button on:click={setTime}>Set Time To Now</button>
	</div>
	<div class="time-select">
		<DateInput
			format="yyyy/MM/dd"
			bind:value={$editingEpisode['@_start'].dateTime}
			locale={{ weekStartsOn: 0 }}
		/>
		<span class="spacer" />
		<Time type="start" bind:date={$editingEpisode['@_start']} />
	</div>
</div>

<style>
	.live-start {
		margin-bottom: 8px;
	}

	.header {
		display: flex;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.header button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 2px 8px;
		margin: 0 38px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
	}

	.time-select {
		display: flex;
		align-items: center;
	}
	.spacer {
		width: 16px;
	}
</style>
