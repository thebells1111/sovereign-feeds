<script>
	import Delete from '$lib/icons/Delete.svelte';
	import Refresh from '$lib/icons/Refresh.svelte';
	import { valueAudioItem } from '$/editor';
	export let syncSong = () => {};
	export let postproduction = false;

	function formatTime(timeInSeconds) {
		let hours = Math.floor(timeInSeconds / 3600);
		let minutes = Math.floor((timeInSeconds % 3600) / 60);
		let seconds = Math.floor(timeInSeconds % 60);

		let formattedTime = '';

		if (hours > 0) {
			formattedTime += `${hours}:`;
		}

		if (minutes < 10 && hours > 0) {
			formattedTime += `0${minutes}:`;
		} else {
			formattedTime += `${minutes}:`;
		}

		if (seconds < 10) {
			formattedTime += `0${seconds}`;
		} else {
			formattedTime += `${seconds}`;
		}

		return formattedTime;
	}

	function deleteSong(index) {
		let confirmation = confirm('Are you sure you want to delete ' + $valueAudioItem[index].song);
		if (confirmation) {
			$valueAudioItem.splice(index, 1);
			$valueAudioItem = $valueAudioItem;
		}
	}
</script>

{#each $valueAudioItem as item, index}
	<song-card>
		<song-info>
			<h4>{index + 1}</h4>
			<p><strong>Song: </strong>{item.song}</p>
			<p><strong>Artist: </strong>{item.author}</p>
			<p><strong>Album: </strong>{item.album}</p>
		</song-info>
		<time-container>
			<p><strong>Song Duration:</strong> <span>{formatTime(item.duration)}</span></p>

			{#if item.added || item.added === 0}
				{#if postproduction}
					Synced Time (in seconds):
					<input bind:value={item.added} />
				{:else}
					<p><strong>Synced Time:</strong> <span>{formatTime(item.added)}</span></p>
				{/if}
			{/if}
		</time-container>
		<button-container>
			<button class="sync" on:click={syncSong.bind(this, item, index)}>
				<Refresh size="30" />
				<p>Sync</p>
			</button>

			<button on:click|stopPropagation={deleteSong.bind(this, index)}>
				<Delete size="30" />
			</button>
		</button-container>
	</song-card>
{/each}

<style>
	song-card {
		display: flex;
		flex-direction: column;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
		width: calc(100% - 32px);
		margin: 4px 8px;
		padding: 4px 8px;
		border-radius: 8px;
		justify-content: space-between;
	}

	song-card p {
		margin: 0;
		padding: 0;
	}

	button-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	h4 {
		margin: 0;
		text-align: right;
	}

	button {
		color: hsla(352, 100%, 33%, 1);
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		background-color: transparent;
	}
	.sync {
		position: relative;
		color: green;
	}
	.sync p {
		padding: 0;
		margin: 0;
		font-size: 0.8em;
		position: absolute;
		bottom: -2px;
		color: green;
	}
</style>
