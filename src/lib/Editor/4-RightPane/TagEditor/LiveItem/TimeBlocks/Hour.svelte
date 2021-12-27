<script>
	import NumberInput from '../NumberInput/NumberInput.svelte';
	export let date;
	export let meridian;
	$: console.log(date);

	let initialize = true;
	let hour;

	$: if (initialize && date) {
		if (new Date(date).getHours() > 11) {
			meridian = true;
			initialize = false;
			hour = convertToTwelveHours(date);
		} else {
			hour = new Date(date).getHours();
		}
	}

	function convertToTwelveHours(date) {
		let h = new Date(date).getHours();
		if (h > 12) {
			h -= 12;
		}
		if (h === 0) {
			h = 12;
		}
		return h;
	}

	function setMeridian(m) {
		if (date) {
			let d = new Date(date);
			if (m) {
				d.setHours(hour + 12);
			} else {
				d.setHours(hour);
			}

			date = d;
		}
	}

	$: setMeridian(meridian);

	function handleInput(value) {
		let d = new Date(date);
		d.setHours(meridian ? value + 12 : value);
		date = d;
	}
</script>

<NumberInput max={12} min={1} value={hour} blurDefault={12} {handleInput} disableScroll={true} />
