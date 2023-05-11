<script>
	import { editingEpisode, valueAudioItem } from '$/editor';
	import AudioItem from './AudioItem.svelte';
	let player;
	export let activeValueBlock = {};

	$: console.log($editingEpisode?.['podcast:value']);

	function syncSong(song, index) {
		let originalAdded = parseFloat(song.added);
		let offset = player.currentTime - originalAdded;
		song.added = player.currentTime;

		$valueAudioItem = $valueAudioItem;
		setTimeout(conf, 10);

		function conf() {
			// Show a confirmation dialog
			const confirmation = window.confirm(
				`Would you like to offset the songs after this on by ${offset} seconds to keep them in sync?`
			);

			if (confirmation) {
				// Update the 'added' key of the remaining objects in the array
				for (let i = index + 1; i < $valueAudioItem.length; i++) {
					if (parseFloat($valueAudioItem[i].added) > originalAdded) {
						$valueAudioItem[i].added = parseFloat($valueAudioItem[i].added) + offset;
					}
				}
			}

			$valueAudioItem = $valueAudioItem;
		}
	}
</script>

<container>
	<active-value>
		<h2>Active Value Block</h2>
		{#if activeValueBlock.meta}
			<active-meta>
				<img src={activeValueBlock.meta.artwork} width="100" height="100" />
				<info>
					<p><b>Song: </b>{activeValueBlock.meta.song}</p>
					<p><b>Artist: </b>{activeValueBlock.meta.author}</p>
					<p><b>Album: </b>{activeValueBlock.meta.album}</p>
				</info>
			</active-meta>

			<h3>Remote Value Block</h3>
			<ul>
				{#each activeValueBlock.remote || [] as item}
					<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
				{/each}
			</ul>

			<h3>Podcaster's Value Block</h3>
			<ul>
				{#each activeValueBlock.base || [] as item}
					<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
				{/each}
			</ul>

			<h3>SF Live</h3>
			<ul>
				<li>({activeValueBlock.sf.split}%) SF Live</li>
			</ul>
		{/if}
	</active-value>

	<audio-items>
		<AudioItem liveproduction={true} {syncSong} bind:activeValueBlock />
	</audio-items>
</container>

<style>
	container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-template-areas: 'active audio';
		overflow: hidden;
		flex: 1;
	}

	audio-items {
		overflow-x: hidden;
		overflow-y: auto;
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		grid-area: audio;
	}

	active-value {
		display: block;
		overflow-y: auto;
		overflow-x: hidden;
		display: block;
		grid-area: active;
		overflow-y: auto;
		overflow-x: hidden;
		border-right: 1px solid var(--border-color);
	}

	active-meta {
		display: flex;
	}

	info p {
		padding: 4px 8px;
	}
</style>
