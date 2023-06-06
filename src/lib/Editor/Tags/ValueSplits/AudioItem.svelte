<script>
	import clone from 'just-clone';
	import Delete from '$lib/icons/Delete.svelte';
	import Refresh from '$lib/icons/Refresh.svelte';
	import Play from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import { valueAudioItem, editingEpisode, rssData, showLiveEpisodes } from '$/editor';
	export let syncSong = () => {};
	export let postproduction = false;
	export let liveproduction = false;
	export let activeValueBlock = {};
	export let playSongOnSync = false;
	export let defaultValueSwitch = false;
	export let playAllSongs = false;
	export let isPCValue = true;
	export let socket = undefined;
	export let player;
	let timeRemaining = 0;
	let timerInterval;

	$: console.log(activeValueBlock);

	let sovereignSplit = 5;

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
		isPCValue = false;
		let baseBlock = updateSplits(
			convertArray(
				filterItemsWithAddress($editingEpisode?.['podcast:value']?.['podcast:valueRecipient']) ||
					filterItemsWithAddress($rssData?.['podcast:value']?.['podcast:valueRecipient'])
			),
			(100 - sovereignSplit) * (100 - item.split)
		);

		let remoteBlock = updateSplits(
			item?.value?.destinations || [],
			(100 - sovereignSplit) * item.split
		);

		function filterItemsWithAddress(array) {
			let filtered = [].concat(array).filter((item) => {
				return item['@_address'] !== '';
			});
			if (filtered.length < 1) {
				return null;
			}
			return filtered;
		}
		function convertArray(inputArray) {
			if (!inputArray) {
				return null;
			}

			return inputArray.map((item) => {
				let newItem = {};

				if (item['@_name'] !== undefined) newItem.name = item['@_name'];
				if (item['@_type'] !== undefined) newItem.type = item['@_type'];
				else newItem.type = 'node';
				if (item['@_address'] !== undefined) newItem.address = item['@_address'];
				if (item['@_split'] !== undefined) newItem.split = parseInt(item['@_split'], 10) || 0;
				if (item['@_customKey'] !== undefined) newItem.customKey = item['@_customKey'];
				if (item['@_customValue'] !== undefined) newItem.customValue = item['@_customValue'];
				if (item['@_fee'] !== undefined) newItem.fee = item['@_fee'];

				return newItem;
			});
		}

		let sovereignBlock = {
			name: 'SF Live',
			type: 'node',
			address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			split: sovereignSplit,
			customKey: '696969',
			customValue: 'eChoVKtO1KujpAA5HCoB'
		};

		let newBlock = {
			meta: item,
			base: baseBlock || [],
			remote: remoteBlock || [],
			sf: sovereignBlock
		};

		activeValueBlock = newBlock;

		let serverValueBlock = {
			model: {
				type: 'lightning',
				method: 'keysend'
			},
			destinations: baseBlock.concat(remoteBlock).concat(sovereignBlock)
		};
		console.log(item);
		let valueGuid = $editingEpisode?.['@_liveValueLink'].split('event_id=')[1];
		let serverData = {
			feedTitle: item.album,
			feedGuid: item.albumGuid,
			artwork: item.artwork,
			author: item.author,
			itemTitle: item.song,
			itemGuid: item.songGuid,
			value: serverValueBlock
		};

		socket.emit('valueBlock', { valueGuid, serverData });
	}

	function updateSplits(array, remotePercentage) {
		const newArray = [].concat(array);
		let totalSplit = 0;
		newArray.forEach((item) => {
			if (item?.fee !== true && item?.fee !== 'true') {
				totalSplit += item?.split;
			}
		});

		let percentagedArray = clone(newArray).map((item) => {
			if (item?.fee !== true && item?.fee !== 'true') {
				item.split = ((item?.split / totalSplit) * remotePercentage) / 100;
			}
			return item;
		});

		return percentagedArray;
	}

	async function handleSyncClick(item, index) {
		if (!postproduction && $showLiveEpisodes) {
			updateValueBlock(item);
		}
		if (player) {
			player.src = item.url;
			player.play();

			player.ontimeupdate = () => {
				timeRemaining = (player.duration - player.currentTime) * 1000;
			};

			player.onended = () => {
				if (playAllSongs) {
					if (index < $valueAudioItem.length - 1) {
						let newIndex = index + 1;
						handleSyncClick($valueAudioItem[newIndex], newIndex);
					} else {
						handleAutoSwitch();
					}
				} else {
					handleAutoSwitch();
				}
			};
		} else {
			let startTime = new Date().getTime();
			timeRemaining = timeRemaining = item.duration * 1000;

			if (timerInterval) {
				clearInterval(timerInterval);
			}

			timerInterval = setInterval(handleTimer.bind(this, startTime, item), 100);

			function handleTimer(startTime, item) {
				timeRemaining = startTime + item.duration * 1000 - new Date().getTime();

				if (timeRemaining <= 0) {
					clearInterval(timerInterval);
					timeRemaining = 0;
					if (defaultValueSwitch) {
						handleAutoSwitch();
					}
				}
			}
		}

		syncSong(item, index);

		function handleAutoSwitch() {
			if (defaultValueSwitch) {
				activeValueBlock = {};
				isPCValue = true;
				let valueGuid = $editingEpisode?.['@_liveValueLink'].split('?event_id=')[1];
				socket.emit('valueBlock', { valueGuid, serverData: {} });
			}
		}
	}
</script>

{#each $valueAudioItem as item, index}
	<song-card
		class:active={$showLiveEpisodes &&
			activeValueBlock &&
			activeValueBlock?.meta?._id === item?._id}
	>
		<top-container>
			<song-info>
				<p><strong>Song: </strong>{item.song}</p>
				<p><strong>Artist: </strong>{item.author}</p>
				<p><strong>Album: </strong>{item.album}</p>
			</song-info>
			<right-pane>
				{#if $showLiveEpisodes}
					{#if activeValueBlock && activeValueBlock?.meta?._id === item?._id}
						<active>Active</active>
					{:else}
						<inactive />
					{/if}
				{/if}
				<split>
					<p>
						Give
						{#if postproduction || liveproduction}
							<input type="number" bind:value={item.split} min="0" max="100" />
						{:else}
							{item.split}
						{/if}
						%
						<br />
						to this block
					</p>
				</split>
			</right-pane>
		</top-container>
		<time-container>
			<p><strong>Song Duration:</strong> <span>{formatTime(item.duration)}</span></p>
			<p><strong>Synced Time:</strong> <span>{formatTime(item.added)}</span></p>
			{#if activeValueBlock && activeValueBlock?.meta?._id === item?._id}
				<p>
					<strong>Time Remaining:</strong>
					<span>{timeRemaining ? formatTime(timeRemaining / 1000) : ''}</span>
				</p>
			{:else}
				<vertical-spacer />
			{/if}

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
			<button class="sync" on:click={handleSyncClick.bind(this, item, index)}>
				{#if playSongOnSync}
					{#if activeValueBlock && activeValueBlock?.meta?._id === item?._id}
						{#if player.paused}<Play size="30" />
							<p>Play</p>
						{:else}
							<Pause size="30" />
							<p>Pause</p>
						{/if}
					{:else}
						<Play size="30" />
						<p>Play</p>
					{/if}
				{:else}
					<Refresh size="30" />
					<p>Sync</p>
				{/if}
			</button>
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

	song-card.active {
		background-color: rgba(233, 248, 255, 0.75);
		box-shadow: 0px 0px 5px 0px rgba(0, 113, 166, 0.75);
	}

	active,
	inactive {
		display: flex;
		height: 36px;
		color: hsla(352, 100%, 33%, 1);
		font-weight: bold;
		align-items: center;
	}

	right-pane {
		margin-left: 8px;
		min-width: 160px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.activate {
		font-size: 0.8em;
		color: white;
		height: 24px;
		background-image: linear-gradient(to bottom, hsl(120, 100%, 25%), hsl(120, 100%, 15%));
	}

	vertical-spacer {
		display: block;
		height: 21px;
	}
</style>
