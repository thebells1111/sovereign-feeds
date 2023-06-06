<script>
	import { valueAudioItem } from '$/editor';
	import SharedValueComponent from '$lib/Editor/Tags/Value/SharedValueComponent.svelte';
	import CancelFilled from '$lib/icons/CancelFilled.svelte';

	let songTitle = '';
	let author = '';
	let albumTitle = '';
	let albumPodcastGuid = '';
	let songGuid = '';
	let artwork = '';
	let value = { 'podcast:valueRecipient': [] };
	let enclosureUrl = '';
	export let basePercent = 95;
	let errorMessage = '';
	let medium = 'album';
	let showValueInput = false;
	$: console.log(value);

	async function addItem() {
		try {
			if (!songTitle || !author || !albumTitle || !artwork || !enclosureUrl || !basePercent) {
				throw new Error('All fields are required!');
			}
			let _id = await generateHashedId(enclosureUrl);
			let song = {
				title: songTitle,
				author,
				album: albumTitle,
				podcastGuid: albumPodcastGuid,
				guid: songGuid,
				artwork,
				value,
				enclosureUrl
			};
			let album = {
				author,
				title: albumTitle,
				podcastGuid: albumPodcastGuid,
				artwork
			};
			let item = {
				_id,
				song: song.title,
				author: album.author,
				album: album.title,
				albumGuid: album.podcastGuid,
				songGuid: song.guid,
				artwork: song.artwork || song.image || album.artwork || album.image,
				value: song?.value,
				url: song.enclosureUrl,
				duration: null,
				startTime: 0,
				added: 0,
				split: basePercent
			};
			$valueAudioItem = $valueAudioItem.concat(item);
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
		artwork: { album: 'Artwork', clip: 'Artwork', other: 'Artwork' }
	};

	async function generateHashedId(url) {
		const encoder = new TextEncoder();
		const data = encoder.encode(`${url}:${new Date().getTime()}`);
		const digest = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(digest));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}
</script>

{#if errorMessage}
	<p style="color: red">{errorMessage}</p>
{/if}
<div>
	<button on:click={addItem}>Add Item</button>
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
		<input type="text" bind:value={enclosureUrl} />
	</label>

	<button
		class="primary"
		on:click={() => {
			showValueInput = true;
		}}
	>
		Edit Value Splits
	</button>

	<h3>Value Block</h3>
	<ul>
		{#each value?.['podcast:valueRecipient'] || [] as item}
			<li>({item['@_split']}% {item['@_fee'] ? 'fee' : ''}) {item['@_name']}</li>
		{/each}
	</ul>
</div>

{#if showValueInput}
	<modal
		on:click|self={() => {
			showValueInput = false;
		}}
	>
		<modal-card>
			<button
				class="cancel"
				on:click={() => {
					showValueInput = false;
				}}
			>
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
</style>
