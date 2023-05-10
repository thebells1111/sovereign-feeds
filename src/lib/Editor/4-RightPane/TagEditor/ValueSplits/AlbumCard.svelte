<script>
	import clone from 'just-clone';
	import Add from '$lib/icons/Add.svelte';
	export let album = {};
	export let selectedAlbum = {};
	export let basePercent;

	import { valueAudioItem } from '$/editor';

	export async function fetchEpisodes(alb) {
		if (selectedAlbum.podcastGuid === alb.podcastGuid) {
			selectedAlbum = {};
		} else if (!alb.songs) {
			let feedUrl = `/api/queryindex?q=${encodeURIComponent(
				`/podcasts/byguid?guid=${alb.podcastGuid}`
			)}`;
			let songsUrl = `/api/queryindex?q=${encodeURIComponent(
				`/episodes/bypodcastguid?guid=${alb.podcastGuid}`
			)}`;

			try {
				let feedRes = await fetch(feedUrl);
				let data = await feedRes.json();
				let feed = data.feed;

				let songsRes = await fetch(songsUrl);
				let songsData = await songsRes.json();
				let songs = [].concat(songsData.items);

				feed.songs = songs;
				album = feed;
				selectedAlbum = album;
			} catch (err) {
				console.error('Error fetching songs:', err);
			}
		} else {
			selectedAlbum = alb;
		}
	}

	async function generateHashedId(url) {
		const encoder = new TextEncoder();
		const data = encoder.encode(`${url}:${new Date().getTime()}`);
		const digest = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(digest));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}

	function getMediaDuration(url) {
		return new Promise((resolve, reject) => {
			const audio = new Audio();
			audio.preload = 'metadata'; // Load only metadata, not the entire file
			audio.src = url;

			audio.onloadedmetadata = () => {
				resolve(audio.duration);
				audio.remove();
			};

			audio.onerror = (error) => {
				reject(error);
				audio.remove();
			};
		});
	}

	async function addItem(song) {
		console.log(clone(song));
		let _id = await generateHashedId(song.enclosureUrl);
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
		console.log(item);
		$valueAudioItem = $valueAudioItem.concat(item);
		getMediaDuration(song.enclosureUrl).then((data) => {
			let itemIndex = $valueAudioItem.findIndex((obj) => obj._id === _id);
			let item = $valueAudioItem[itemIndex];
			item.duration = data;
			if (itemIndex) {
				const previousItem = $valueAudioItem[itemIndex - 1];
				item.startTime = previousItem.startTime + previousItem.duration;
			}
			$valueAudioItem = $valueAudioItem;
			console.log($valueAudioItem);
		});
	}
</script>

{#if album}
	<card on:click={fetchEpisodes.bind(this, album)}>
		<img src={album.artwork || album.image} loading="lazy" width="50" height="50" />
		<album-info>
			<album-title>{album.title}</album-title>
			<album-author>{album.author}</album-author>
		</album-info>
	</card>
	{#if selectedAlbum.podcastGuid === album.podcastGuid && album.songs}
		<ul>
			{#each album.songs as song}
				<li on:click={addItem.bind(this, song)}>
					<icon><Add size="30" /></icon>
					{song.title}
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	card {
		display: flex;
		width: 100%;
		margin-bottom: 8px;
		padding: 4px;
		border-radius: 8px;
		list-style: none;
	}

	img {
		border-radius: 4px;
		margin: 0 auto;
	}

	album-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	album-title,
	album-author {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		padding: 1px;
		font-size: 1.1em;
		font-weight: 5500;
	}

	album-title {
		margin-top: 4px;
	}

	album-author {
		padding-left: 6px;
		font-style: italic;
		font-size: 0.9em;
	}

	ul {
		padding: 8px 0;
	}

	li {
		list-style: none;
		padding: 8px;
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	icon {
		color: rgb(27, 111, 246);
		padding: 0;
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		background-color: transparent;
	}
</style>
