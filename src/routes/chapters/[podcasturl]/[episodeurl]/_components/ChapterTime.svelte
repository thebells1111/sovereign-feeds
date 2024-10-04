<script>
	import NumberInput from '$lib/Tags/Shared/NumberInput.svelte';

	export let time = 0;
	export let chapter;

	$: console.log(chapter);

	$: console.log(time);

	function handleHrChange(hr) {
		let min = Math.floor(time / 60) % 60;
		let sec = Math.floor(time % 60);
		let t = hr * 3600 + min * 60 + sec;
		chapter.startTime = t;
	}
	function handleMinChange(min) {
		let hr = Math.floor(time / 3600);
		let sec = Math.floor(time % 60);
		let t = hr * 3600 + min * 60 + sec;
		chapter.startTime = t;
	}
	function handleSecChange(sec) {
		let hr = Math.floor(time / 3600);
		let min = Math.floor(time / 60) % 60;
		let t = hr * 3600 + min * 60 + sec;
		chapter.startTime = t;
	}
</script>

<h4>Time Stamp:</h4>
<NumberInput max={24} min={0} value={Math.floor(time / 3600)} handleInput={handleHrChange} />
<span>hr</span>
<NumberInput
	max={60}
	min={0}
	value={Math.floor(time / 60) % 60}
	handleInput={handleMinChange}
/><span>min</span>
<NumberInput max={60} min={0} value={Math.floor(time % 60)} handleInput={handleSecChange} /><span
	>sec</span
>

<style>
	h4 {
		margin: 0;
	}
</style>
