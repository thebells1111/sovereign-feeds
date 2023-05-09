<script>
	import Delete from '$lib/icons/Delete.svelte';
	import Refresh from '$lib/icons/Refresh.svelte';
	import { valueAudioItem, editingEpisode, selectedPodcast, rssData } from '$/editor';
	export let syncSong = () => {};
	export let postproduction = false;
	export let liveproduction = false;
	export let activeValueBlock = {};

	function formatTime(timeInSeconds) {
		let totalMilliseconds = timeInSeconds * 1000;
		let hours = Math.floor(timeInSeconds / 3600);
		let minutes = Math.floor((timeInSeconds % 3600) / 60);
		let seconds = Math.floor(timeInSeconds % 60);
		let milliseconds = Math.floor(totalMilliseconds % 1000);

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

		// Include milliseconds as a three-digit decimal
		formattedTime += `.${milliseconds.toString().padStart(3, '0')}`;

		return formattedTime;
	}

	function deleteSong(index) {
		let confirmation = confirm('Are you sure you want to delete ' + $valueAudioItem[index].song);
		if (confirmation) {
			$valueAudioItem.splice(index, 1);
			$valueAudioItem = $valueAudioItem;
		}
	}

	const getHours = (t) => Math.floor(t / 3600) || 0;
	const getMinutes = (t) => Math.floor((t % 3600) / 60) || 0;
	const getSeconds = (t) => Math.floor(t) % 60 || 0;
	const getMilliseconds = (t) => Math.round((t % 1) * 1000) || 0;

	const updateAdded = (type, value, item) => {
		let h = getHours(item);
		let m = getMinutes(item.added);
		let s = getSeconds(item.added);
		let ms = getMilliseconds(item.added);

		if (type === 'hours') {
			h = parseInt(value);
		} else if (type === 'minutes') {
			m = parseInt(value);
		} else if (type === 'seconds') {
			s = parseInt(value);
		} else if (type === 'milliseconds') {
			ms = parseInt(value);
		}

		item.added = h * 3600 + m * 60 + s + ms / 1000;
		$valueAudioItem = $valueAudioItem;
	};

	function updateValueBlock(item) {
		console.log(item);
		activeValueBlock = item;
		console.log($rssData?.['podcast:value']?.['podcast:valueRecipient']);
		console.log($editingEpisode?.['podcast:value']?.['podcast:valueRecipient']);
		console.log(item?.value);

		function filterItemsWithAddress(array) {
			return array.filter((item) => item['@_address'] !== '');
		}
		function convertArray(inputArray) {
			return inputArray.map((item) => {
				return {
					name: item['@_name'],
					type: item['@_type'],
					address: item['@_address'],
					split: parseInt(item['@_split'], 10) || 0,
					customKey: item['@_customKey'] || '',
					customValue: item['@_customValue'] || '',
					fee: item['@_fee'] === 'true'
				};
			});
		}
	}
</script>

{#each $valueAudioItem as item, index}
	<song-card>
		<top-container>
			<song-info>
				<p><strong>Song: </strong>{item.song}</p>
				<p><strong>Artist: </strong>{item.author}</p>
				<p><strong>Album: </strong>{item.album}</p>
			</song-info>
			<split>
				<p>
					Give
					{#if postproduction || liveproduction}
						<input type="number" bind:value={item.split} min="0" max="100" />
					{:else}
						{item.split}
					{/if}
					% to this block
				</p>
			</split>
		</top-container>
		<time-container>
			<p><strong>Song Duration:</strong> <span>{formatTime(item.duration)}</span></p>
			<p><strong>Synced Time:</strong> <span>{formatTime(item.added)}</span></p>

			{#if item.added || item.added === 0}
				{#if postproduction}
					<time-inputs>
						<label>
							Hours:
							<input
								type="number"
								value={getHours(item?.added)}
								on:input={(e) => updateAdded('hours', e.target.value, item)}
								min="0"
							/>
						</label>
						<label>
							Minutes:
							<input
								type="number"
								value={getMinutes(item?.added)}
								on:input={(e) => updateAdded('minutes', e.target.value, item)}
								min="0"
								max="59"
							/>
						</label>
						<label>
							Seconds:
							<input
								type="number"
								value={getSeconds(item?.added)}
								on:input={(e) => updateAdded('seconds', e.target.value, item)}
								min="0"
								max="59"
							/>
						</label>
						<label>
							Milliseconds:
							<input
								type="number"
								value={getMilliseconds(item?.added)}
								on:input={(e) => updateAdded('milliseconds', e.target.value, item)}
								min="0"
								max="999"
							/>
						</label>
					</time-inputs>
				{/if}
			{/if}
		</time-container>
		<button-container>
			{#if !liveproduction}
				<button class="sync" on:click={syncSong.bind(this, item, index)}>
					<Refresh size="30" />
					<p>Sync</p>
				</button>
			{:else}
				<button on:click={updateValueBlock.bind(this, item, index)}>Use this value block</button>
			{/if}
			<h4>{index + 1}</h4>
			<button on:click|stopPropagation={deleteSong.bind(this, index)}>
				<Delete size="30" />
			</button>
		</button-container>
	</song-card>
{/each}

<style>
	top-container {
		display: flex;
		position: relative;
		justify-content: space-between;
	}

	top-container split {
		display: block;
	}

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
		align-self: flex-end;
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

	time-inputs {
		display: flex;
	}

	time-inputs label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		width: 100px;
		margin: 0 8px;
		justify-content: center;
		align-items: center;
	}

	time-inputs label input {
		width: 60%;
		text-align: center;
	}

	split p input {
		width: 55px;
		text-align: center;
		margin: 0 0 0 6px;
	}
</style>
