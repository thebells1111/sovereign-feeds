<script>
	export let type;

	import NumberInput from '../NumberInput/NumberInput.svelte';

	export let date;

	function handleHourInput(value) {
		date.hour = value;
	}

	function handleMinuteInput(value) {
		date.minute = padZero(value);
	}

	function padZero(num) {
		num = Number(num);
		if (num < 10) {
			return '0' + num;
		}
		return num;
	}
</script>

{#if date}
	<NumberInput
		max={12}
		min={1}
		value={date.hour}
		blurDefault={12}
		handleInput={handleHourInput}
		disableScroll={true}
	/>
	<span>:</span>
	<NumberInput
		max={59}
		min={0}
		value={date.minute}
		blurDefault={0}
		handleInput={handleMinuteInput}
		disableScroll={true}
	/>
	<div>
		<label>
			<input type="radio" bind:group={date.meridian} name={type} value={false} />
			am
		</label>

		<label>
			<input type="radio" bind:group={date.meridian} name={type} value={true} />
			pm
		</label>
	</div>
{/if}

<style>
	div {
		height: 40px;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		width: 100px;
	}
</style>
