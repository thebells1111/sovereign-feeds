<script>
	import { valueAudioItem, editingAudioItem } from '$/editor';
	import SharedValueComponent from '$lib/Editor/Tags/Value/SharedValueComponent.svelte';
	import CancelFilled from '$lib/icons/CancelFilled.svelte';

	let albumTitle = '';
	let albumPodcastGuid = '';
	let artwork = '';
	let author = '';
	let duration = 0;
	let songTitle = '';
	let songGuid = '';
	let enclosureUrl = '';
	let value = { 'podcast:valueRecipient': [] };

	export let basePercent = 95;
	let errorMessage = '';
	let medium = 'album';
	let showValueInput = false;
	let urlWarning = '';
	$: console.log(value);

	$: handleItemUpdate($editingAudioItem);

	function handleItemUpdate(item) {
		albumTitle = item?.album || '';
		albumPodcastGuid = item?.albumGuid;
		artwork = item?.artwork || '';
		author = item?.author || '';
		duration = item?.duration || 0;
		songTitle = item?.song || '';
		songGuid = item?.songGuid;
		enclosureUrl = item?.url || '';
		value['podcast:valueRecipient'] =
			item?.value?.destinations?.map((item) => {
				let newItem = {};
				for (let key in item) {
					newItem['@_' + key] = item[key];
				}
				return newItem;
			}) || [];
		medium = item?.medium || 'album';
	}

	async function newItem() {
		$editingAudioItem = null;
	}

	$: console.log(duration);

	async function saveItem() {
		try {
			let _id = await generateHashedId(enclosureUrl);

			let item = {
				_id,
				song: songTitle,
				author: author,
				album: albumTitle,
				albumGuid: albumPodcastGuid,
				songGuid: songGuid,
				artwork: artwork,
				value: value,
				url: enclosureUrl,
				duration: duration || 0,
				startTime: 0,
				added: 0,
				split: basePercent,
				medium: medium
			};

			if ($editingAudioItem) {
				let id = $editingAudioItem['_id'];
				let savedItem = $valueAudioItem.find((v) => v['_id'] === id);

				savedItem.song = songTitle;
				savedItem.author = author;
				savedItem.album = albumTitle;
				savedItem.artwork = artwork;
				savedItem.value = value;
				savedItem.url = enclosureUrl;
				savedItem.duration = duration || 0;
				savedItem.medium = medium;
				savedItem.value = {
					model: {
						type: 'lightning',
						method: 'keysend'
					},
					destinations: []
				};
				savedItem.value.destinations = value['podcast:valueRecipient'].map((item) => {
					let newItem = {};
					for (let key in item) {
						// Remove '@_' from the start of each key
						let newKey = key.startsWith('@_') ? key.slice(2) : key;
						newItem[newKey] = item[key];
					}
					return newItem;
				});

				$valueAudioItem = $valueAudioItem;
			} else {
				$editingAudioItem = item;
				$valueAudioItem = $valueAudioItem.concat(item);
			}

			errorMessage = '';
		} catch (error) {
			errorMessage = error.message;
			setTimeout(() => {
				errorMessage = '';
			}, 1000);
		}
	}

	const labels = {
		albumTitle: { album: 'Album Title', clip: 'Podcast Title', other: 'Main Title' },
		songTitle: { album: 'Song Title', clip: 'Clip Title', other: 'SubTitle' },
		author: { album: 'Artist', clip: 'Clip Author', other: 'Author' },
		artwork: { album: 'Artwork', clip: 'Artwork', other: 'Artwork' },
		duration: { album: 'Song Duration', clip: 'Clip Duration', other: 'Duration' }
	};

	async function generateHashedId(url) {
		const encoder = new TextEncoder();
		const data = encoder.encode(`${url}:${new Date().getTime()}`);
		const digest = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(digest));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}

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

	const getHours = (t) => Math.floor(t / 3600) || 0;
	const getMinutes = (t) => Math.floor((t % 3600) / 60) || 0;
	const getSeconds = (t) => Math.floor(t) % 60 || 0;
	const getMilliseconds = (t) => Math.round((t % 1) * 1000) || 0;

	const updateDuration = (type, value, item) => {
		let h = getHours(duration);
		let m = getMinutes(duration);
		let s = getSeconds(duration);
		let ms = getMilliseconds(duration);

		if (type === 'hours') {
			h = parseInt(value);
		} else if (type === 'minutes') {
			m = parseInt(value);
		} else if (type === 'seconds') {
			s = parseInt(value);
		} else if (type === 'milliseconds') {
			ms = parseInt(value);
		}

		duration = h * 3600 + m * 60 + s + ms / 1000;
	};

	$: splits = getSplitValue(value?.['podcast:valueRecipient']);

	function getSplitValue(recipient) {
		if (Array.isArray(recipient)) {
			return recipient.reduce((acc, v) => (v?.['@_fee'] ? acc : acc + Number(v?.['@_split'])), 0);
		} else {
			return 0;
		}
	}

	function closeModal() {
		if (splits !== 100) {
			if (
				window.confirm(
					"Splits don't add up to 100%, are you sure you want to close the value editor?"
				)
			) {
				showValueInput = false;
			}
		} else {
			showValueInput = false;
		}
	}

	let supportedFormats = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];

	// Reactive statement
	$: {
		if (enclosureUrl) {
			let fileExtension = enclosureUrl.split('.').pop();
			// Check if the URL is a link to a supported audio file
			if (supportedFormats.includes('.' + fileExtension.toLowerCase())) {
				let audio = new Audio();
				audio.src = enclosureUrl;
				audio.addEventListener('loadedmetadata', function () {
					// Checking if the media file is playable by an HTML5 audio player.
					if (audio.duration !== Infinity && audio.duration > 0) {
						duration = audio.duration;
					} else {
						urlWarning = 'The URL does not link to a supported audio file';
					}
				});
				urlWarning = '';
			} else {
				urlWarning = 'The URL does not link to a supported audio file';
			}
		} else {
			urlWarning = '';
		}
	}
</script>

<top-buttons>
	<button
		class="primary edit-splits"
		on:click={() => {
			showValueInput = true;
		}}
	>
		Edit Value Splits
	</button>
	<button class="primary new-item" on:click={newItem}>New Item</button>
	<button class="primary save-item" on:click={saveItem}>Save Item</button>
</top-buttons>
{#if errorMessage}
	<p style="color: red">{errorMessage}</p>
{/if}
<div>
	<label>
		Media Type
		<select bind:value={medium}>
			<option value="album">Album</option>
			<option value="other">Other</option>
		</select>
	</label>
	<label>
		{labels.albumTitle[medium]}
		<input type="text" bind:value={albumTitle} />
	</label>
	<label>
		{labels.songTitle[medium]}
		<input type="text" bind:value={songTitle} />
	</label>
	<label>
		{labels.author[medium]}
		<input type="text" bind:value={author} />
	</label>

	<label>
		{labels.artwork[medium]}
		<input type="text" bind:value={artwork} />
	</label>

	<label>
		Enclosure Url (Link to mp3 file)
		{#if urlWarning}
			<p>{urlWarning}</p>
		{/if}
		<input type="text" bind:value={enclosureUrl} />
	</label>
	{#if !enclosureUrl}
		<duration>
			<p>{labels.duration[medium]}</p>
			<time-inputs>
				<label>
					Hours:
					<input
						type="number"
						value={getHours(duration)}
						on:input={(e) => updateDuration('hours', e.target.value, duration)}
						min="0"
					/>
				</label>
				<label>
					Minutes:
					<input
						type="number"
						value={getMinutes(duration)}
						on:input={(e) => updateDuration('minutes', e.target.value, duration)}
						min="0"
						max="59"
					/>
				</label>
				<label>
					Seconds:
					<input
						type="number"
						value={getSeconds(duration)}
						on:input={(e) => updateDuration('seconds', e.target.value, duration)}
						min="0"
						max="59"
					/>
				</label>
				<label>
					Milliseconds:
					<input
						type="number"
						value={getMilliseconds(duration)}
						on:input={(e) => updateDuration('milliseconds', e.target.value, duration)}
						min="0"
						max="999"
					/>
				</label>
			</time-inputs>
		</duration>
	{:else}
		<duration>
			<p>{labels.duration[medium]}</p>
			<time>{formatTime(duration)}</time>
		</duration>
	{/if}
</div>

{#if showValueInput}
	<modal on:click|self={closeModal}>
		<modal-card>
			<button class="cancel" on:click={closeModal}>
				<CancelFilled size="30px" />
			</button>
			<SharedValueComponent bind:data={value} support={false} />
		</modal-card>
	</modal>
{/if}

<style>
	modal {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	modal-card {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
		height: calc(100% - 128px);
		width: calc(100% - 128px);
		position: relative;
	}

	.cancel {
		color: red;
		position: absolute;
		right: 0;
		top: 0;
		padding: 4px 4px 0 4px;
		margin: 0;
		background-color: transparent;
		border: none;
		z-index: 5;
	}

	label,
	duration {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		color: hsla(352, 100%, 33%, 1);
	}

	duration p {
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	duration time {
		color: initial;
		font-weight: initial;
		padding-left: 8px;
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

	top-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
	}

	.edit-splits {
		background-image: linear-gradient(to bottom, hsl(303, 100%, 44%), hsl(303, 100%, 26.7%));
	}

	.new-item {
		background-image: linear-gradient(to bottom, hsl(23, 100%, 44%), hsl(23, 100%, 26.7%));
		margin-right: 8px;
	}

	.save-item {
		background-image: linear-gradient(to bottom, hsl(183, 100%, 44%), hsl(183, 100%, 26.7%));
		margin-right: 8px;
	}
</style>
