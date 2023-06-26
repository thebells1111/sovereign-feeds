<script>
	import clone from 'just-clone';
	import { editingEpisode, valueAudioItem, showLiveEpisodes, copiedValueAudioItem } from '$/editor';
	import AudioItem from './AudioItem.svelte';
	import Enclosure from '../EpisodeMetadata/components/Enclosure.svelte';
	let player;
	let offsetSyncEnabled = true;
	let showCopied = false;

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

		console.log(song.added);

		if (offsetSyncEnabled) {
			setTimeout(conf, 10);
		}

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

	function copySplits() {
		$copiedValueAudioItem = clone($valueAudioItem);
		showCopied = true;
		setTimeout(() => {
			showCopied = false;
		}, 1000);
	}

	function pasteSplits() {
		if ($valueAudioItem.length) {
			const confirmation = window.confirm(
				`You already have items in your splits. Would you like to overwrite them?`
			);

			if (confirmation) {
				$valueAudioItem = clone($copiedValueAudioItem);
			}
		} else {
			$valueAudioItem = clone($copiedValueAudioItem);
		}
	}
</script>

<post-production>
	{#if !$showLiveEpisodes}
		<top-bar>
			<label>
				<input type="checkbox" bind:checked={offsetSyncEnabled} />
				Offset Sync ({offsetSyncEnabled ? 'on' : 'off'})
			</label>
			{#if $copiedValueAudioItem}
				<button class="primary" on:click={pasteSplits}>Paste Splits</button>
			{/if}
		</top-bar>
		<audio-items>
			<AudioItem postproduction={true} {syncSong} />
		</audio-items>

		<player>
			<Enclosure />
			<audio bind:this={player} src={$editingEpisode?.enclosure?.['@_url']} controls />
		</player>
	{:else}
		<live-post>
			{#if showCopied}
				<h3>Copied!!!</h3>
			{:else}
				<button class="primary" on:click={copySplits}>Copy Splits</button>
			{/if}
		</live-post>
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
	live-post {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 40px;
	}
	live-post h3 {
		margin: 0;
		padding: 0;
	}

	top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 4px;
	}

	.primary {
		background-image: linear-gradient(to bottom, hsl(31, 100%, 44%), hsla(31, 100%, 26.7%, 1));
	}
</style>
