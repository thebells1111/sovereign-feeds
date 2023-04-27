<script>
	import { editingEpisode, valueAudioItem } from '$/editor';
	import AudioItem from './AudioItem.svelte';
	import Enclosure from '../EpisodeMetadata/components/Enclosure.svelte';
	console.log($editingEpisode);
	let player;

	// function syncSong(song, index) {
	// 	let originalAdded = song.added

	// 	song.added = player.currentTime;
	// 	$valueAudioItem = $valueAudioItem;
	// }

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

<AudioItem postproduction={true} {syncSong} />

<player>
	<Enclosure />
	<audio bind:this={player} src={$editingEpisode?.enclosure?.['@_url']} controls />
</player>

<style>
	player {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	audio {
		width: 100%;
	}
</style>
