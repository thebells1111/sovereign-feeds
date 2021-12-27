<script>
	import { player } from '$/stores';

	import SpeakerLow from '$lib/icons/SpeakerLow.svelte';
	import SpeakerOff from '$lib/icons/SpeakerOff.svelte';
	import SpeakerMed from '$lib/icons/SpeakerMed.svelte';
	import SpeakerHigh from '$lib/icons/SpeakerHigh.svelte';
	import Slider from './Slider.svelte';

	const size = 30;
	const volumeIcons = [SpeakerOff, SpeakerLow, SpeakerMed, SpeakerHigh, SpeakerHigh];
	let volume = 100;
	function handleChange() {
		$player.volume(volume / 100);
	}
</script>

<div>
	<svelte:component this={volumeIcons[Math.ceil(volume / 33)]} {size} />
	<Slider bind:value={volume} {handleChange} />
	<span>{volume}</span>
</div>

<style>
	div {
		display: flex;
		align-items: center;
	}

	span {
		width: 2em;
	}
</style>
