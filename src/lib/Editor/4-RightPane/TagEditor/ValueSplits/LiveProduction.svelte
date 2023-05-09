<script>
	import { editingEpisode, valueAudioItem } from '$/editor';
	import AudioItem from './AudioItem.svelte';
	let player;
	let activeValueBlock = {};

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
		{activeValueBlock.song}
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
</style>
