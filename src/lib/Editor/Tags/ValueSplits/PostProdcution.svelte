<script>
	import { editingEpisode, valueAudioItem, showLiveEpisodes } from '$/editor';
	import AudioItem from './AudioItem.svelte';
	import Enclosure from '../EpisodeMetadata/components/Enclosure.svelte';
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

<post-production>
	<audio-items>
		<AudioItem postproduction={true} {syncSong} />
	</audio-items>
	{#if !$showLiveEpisodes}
		<player>
			<Enclosure />
			<audio bind:this={player} src={$editingEpisode?.enclosure?.['@_url']} controls />
		</player>
	{/if}
</post-production>

<style>
	post-production {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	audio-items {
		overflow-x: hidden;
		overflow-y: auto;
		flex: 1;
	}
	player {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	audio {
		width: 100%;
	}
</style>
