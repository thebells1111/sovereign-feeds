<script>
	import { onDestroy } from 'svelte';
	export let onTimeUpdate = () => {};

	let timer = null;
	let timerActive = false;
	let startTime;
	let pauseTime = 0;

	function toggleTimer() {
		if (timerActive) {
			pauseTimer();
		} else {
			startTimer();
		}
	}

	function startTimer() {
		timerActive = true;
		startTime = performance.now() - pauseTime;

		timer = setInterval(() => {
			const elapsedTime = (performance.now() - startTime) / 1000;
			onTimeUpdate(elapsedTime);
		}, 10);
	}

	function pauseTimer() {
		timerActive = false;
		clearInterval(timer);
		pauseTime = performance.now() - startTime;
	}

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<button class="primary" on:click={toggleTimer}>
	{#if timerActive}
		Pause syncing
	{:else}
		Start syncing
	{/if}
</button>

<style>
	button {
		background-image: linear-gradient(to bottom, hsla(140, 100%, 33%, 1), hsla(140, 100%, 16%, 1));
	}
</style>
