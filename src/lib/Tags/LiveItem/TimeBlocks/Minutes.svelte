<script>
	import NumberInput from '../NumberInput/NumberInput.svelte';
	export let date;
	$: minutes = padZero(new Date(date).getMinutes());

	function handleInput(value) {
		let d = new Date(date);
		d.setMinutes(value);
		date = d;
	}

	function padZero(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num;
	}
</script>

<NumberInput
	max={59}
	min={0}
	value={minutes}
	blurDefault={0}
	{handleInput}
	disableScroll={true}
	zeroPad={true}
/>
