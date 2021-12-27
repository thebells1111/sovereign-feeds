<script>
	import { trackerDB, selectedPodcast } from '$/editor';

	let customInput;

	let trackers = {
		active: [],
		custom: []
	};

	let baseTrackers = [
		{
			url: 'op3.dev/e/',
			description: `OP3 (Open Podcast Prefix Project) is a free and open-source podcast prefix analytics service
      committed to open data and listener privacy. <br /><a href="https://op3.dev/"
        >Find out more here.</a
      >`
		}
	];

	$: getTrackers($selectedPodcast);

	async function getTrackers() {
		if (trackerDB) {
			let storedTrackers = (await trackerDB.getItem(`${$selectedPodcast.url}`)) || {
				active: [],
				custom: []
			};

			trackers = storedTrackers;
		}
	}

	async function toggleActiveTracker(tracker) {
		let activeSet = new Set(trackers.active);
		if (activeSet.has(tracker)) {
			activeSet.delete(tracker);
		} else {
			activeSet.add(tracker);
		}

		trackers.active = [...activeSet];
		await trackerDB.setItem(`${$selectedPodcast.url}`, trackers);
	}

	async function addTracker() {
		let customSet = new Set(trackers.custom);
		customSet.add(customInput.value);
		trackers.custom = [...customSet];

		await trackerDB.setItem(`${$selectedPodcast.url}`, trackers);
		customInput.value = '';
	}

	async function deleteTracker(tracker) {
		let customSet = new Set(trackers.custom);
		customSet.delete(tracker);
		trackers.custom = [...customSet];

		let activeSet = new Set(trackers.active);
		activeSet.delete(tracker);
		trackers.active = [...activeSet];

		await trackerDB.setItem(`${$selectedPodcast.url}`, trackers);
	}

	function handleKeypress(e) {
		console.log(e.key);
		if (e.key === 'Enter') {
			addTracker();
		}
	}
</script>

<h3>Trackers</h3>

<h4>Blue Tags are active. Click any tag to toggle activation.</h4>

{#each baseTrackers as tracker}
	<div>
		<div
			class="tracker-chip"
			class:active={trackers?.active?.indexOf(tracker.url) > -1}
			on:click={toggleActiveTracker.bind(this, tracker.url)}
		>
			{tracker.url}
		</div>
		<p>
			{@html tracker.description}
		</p>
	</div>
{/each}

{#each trackers?.custom || [] as tracker}
	<div>
		<div
			class="tracker-chip"
			class:active={trackers?.active?.indexOf(tracker) > -1}
			on:click={toggleActiveTracker.bind(this, tracker)}
		>
			{tracker}
			<button class="delete-tracker" on:click={deleteTracker.bind(this, tracker)}>X</button>
		</div>
	</div>
{/each}

<div class="custom-add">
	<label>
		Add Custom Tracker Prefix to List:
		<input
			type="text"
			bind:this={customInput}
			on:keypress={handleKeypress}
			on:focus={() => {
				customInput.placeholder = '';
			}}
			on:blur={() => {
				customInput.placeholder = 'custom-prefix.dev/';
			}}
			placeholder="custom-prefix.dev/"
		/>
	</label>
	<button on:click={addTracker}> Add </button>
</div>

<style>
	.custom-add {
		display: flex;
	}

	ul {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.tracker-chip {
		display: inline-block;
		padding: 4px 8px;
		margin: 8px;
		list-style: none;
		background-color: lightgray;
		border-radius: 20px;
		cursor: pointer;
	}

	.tracker-chip.active {
		background-color: hsl(212, 100%, 39%);
		border-radius: 20px;
		color: white;
	}

	.delete-tracker {
		padding: 0;
		margin: 0 0 0 4px;
		background-color: white;
		color: black;
		border-radius: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 24px;
		width: 24px;
	}

	h3 {
		color: hsla(352, 100%, 33%, 1);
	}
</style>
