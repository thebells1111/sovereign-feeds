<script>
	import ChapterImage from './ChapterImage.svelte';
	import CancelFilled from '$lib/icons/CancelFilled.svelte';
	import ChapterTime from './ChapterTime.svelte';
	export let showEditor = false;
	export let chapter;
	export let chapters;
	let lat = '';
	let long = '';
	let location = '';

	$: if (lat && long && location) {
		buildLocation(lat, long, location);
	}

	$: parseCoordinates(chapter);

	function parseCoordinates(tag) {
		location = tag?.location?.name;
		let g = tag?.location?.geo?.split('geo:')?.[1];
		let s = g?.split(',');
		lat = s?.[0];
		long = s?.[1];
	}

	function buildLocation(lat, long, location) {
		chapter.location = { name: location, geo: `geo:${lat},${long}` };
	}

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}

		function showPosition(position) {
			lat = position.coords.latitude;
			long = position.coords.longitude;
		}
	}

	let clipperWidth;

	$: console.log(chapter);
</script>

{#if chapter}
	<section
		class:active={showEditor}
		on:mousedown|self={() => (showEditor = false)}
		on:touchend|self={() => (showEditor = false)}
	>
		<button
			class="closer"
			on:click={(e) => {
				e.stopPropagation();
				showEditor = false;
				chapter = chapter;
				chapters = chapters.sort((a, b) => {
					return a.startTime > b.startTime ? 1 : -1;
				});
			}}
			on:touchend|preventDefault|stopPropagation={(e) => {
				showEditor = false;
				chapter = chapter;
				chapters = chapters.sort((a, b) => {
					return a.startTime > b.startTime ? 1 : -1;
				});
			}}
			style={`left: calc(50% + ${clipperWidth / 2}px - 20px`}
		>
			<CancelFilled size="40" />
		</button>
		<div class="scroll-bar-clipper" bind:clientWidth={clipperWidth}>
			<div class="chapter-image">
				<ChapterImage bind:chapter />
			</div>

			<div class="input-container">
				<ChapterTime bind:time={chapter.startTime} {chapter} />
				<h3>Optional Chapter Data</h3>
				<label>Chapter Title: <input bind:value={chapter.title} /></label>
				<label>Chapter Link: <input bind:value={chapter.url} /></label>
				<label>Chapter Image Link: <input bind:value={chapter.img} /></label>
				<h3>Optional Location of thing discussed in Chapter</h3>

				<div class="location-container">
					<div class="lat-long">
						<label
							>Location Latitude: <input
								bind:value={lat}
								placeholder="Required Coordinates if using Location"
							/></label
						>
						<label
							>Location Longitude: <input
								bind:value={long}
								placeholder="Required Coordinates if using Location"
							/></label
						>
					</div>
					<button class="primary location" on:click={getLocation}>Use Current Location</button>
				</div>
				<label
					>Location Description: <input
						bind:value={location}
						placeholder="Required Description if using Location"
					/></label
				>
			</div>
		</div>
	</section>
{/if}

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.45);
		height: 100vh;
		width: 100vw;
		color: var(--primary-text-color);
		display: none;
		place-items: center;
		z-index: 999;
		backdrop-filter: blur(3px);
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		min-width: 320px;
		width: 50%;
		height: calc(100% - 48px);
		padding: 8px;
		background-color: white;
		color: var(--primary-text-color);
		border-radius: 5px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		backdrop-filter: blur(3px);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.input-container {
		width: 100%;
		margin-top: 4px;
	}

	label {
		font-weight: 650;
	}

	input {
		width: 100%;
	}

	h3 {
		margin: 4px;
		text-align: center;
	}

	.location-container {
		display: flex;
		align-items: center;
	}

	.lat-long {
		width: 100%;
	}

	.location-container button {
		height: 75px;
		width: 75px;
		flex-basis: 75px;
		min-width: 75px;
		margin: 10px 0 0 8px;
		padding: 4px;
		border-radius: 100px;
		font-size: 13px;
		color: white;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.closer {
		display: grid;
		place-content: center;
		position: absolute;
		top: 8px;
		z-index: 4;
		background-color: white;
		width: 32px;
		height: 32px;
		border-radius: 32px;
		border: none;
		color: rgb(170, 0, 0);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}
</style>
