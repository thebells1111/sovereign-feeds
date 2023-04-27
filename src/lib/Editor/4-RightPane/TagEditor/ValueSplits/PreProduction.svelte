<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { valueAlbumList, valueAudioItem } from '$/editor';
	let searchQuery = '';
	let searchInput;
	let filteredAlbumsList = [];
	let selectedAlbum = {};
	import AlbumCard from './AlbumCard.svelte';
	import TimerButton from './TimerButton.svelte';
	import AudioItem from './AudioItem.svelte';

	let formattedTime = '00:00:00:00';
	let syncedTime = 0;

	function handleTimeUpdate(value) {
		syncedTime = value;
		let hours = Math.floor(value / 3600);
		let minutes = Math.floor((value % 3600) / 60);
		let seconds = Math.floor(value % 60);
		let ms = Math.floor((value % 1) * 100);
		formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
	}

	afterNavigate(({ from }) => {
		setTimeout(() => searchInput.select(), 100);
	});

	function sortArrayAlphabetically(arr) {
		const articles = ['a', 'an', 'the'];

		arr.sort((a, b) => {
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();
			const wordA = titleA.split(' ')[0];
			const wordB = titleB.split(' ')[0];

			// If either word is an article, ignore it
			const indexA = articles.includes(wordA) ? 1 : 0;
			const indexB = articles.includes(wordB) ? 1 : 0;

			// Compare the remaining words
			const remainingA = titleA.split(' ').slice(indexA).join(' ');
			const remainingB = titleB.split(' ').slice(indexB).join(' ');

			if (remainingA < remainingB) {
				return -1;
			}
			if (remainingA > remainingB) {
				return 1;
			}
			return 0;
		});
		return arr;
	}

	onMount(async () => {
		if (!$valueAlbumList.length) {
			const res = await fetch(
				`/api/queryindex?q=${encodeURIComponent(
					'podcasts/bymedium?medium=music&max=1000&val=lightning'
				)}`
			);
			let data = await res.json();
			$valueAlbumList = data.feeds || data.feed || [];
			//this removes 100% Retro Live Feed
			$valueAlbumList = sortArrayAlphabetically($valueAlbumList.filter(({ id }) => id !== 5718023));
		}
	});

	$: {
		filteredAlbumsList = $valueAlbumList.filter(
			(obj) =>
				obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				obj.author.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	function syncSong(song) {
		console.log(song);

		song.added = syncedTime;
		$valueAudioItem = $valueAudioItem;
	}
</script>

<container>
	<album-list>
		<input bind:this={searchInput} bind:value={searchQuery} placeholder="filter albums" />
		<list-container>
			<ul>
				{#each filteredAlbumsList as album}
					<li>
						<AlbumCard {album} bind:selectedAlbum />
					</li>
				{/each}
			</ul>
		</list-container>
	</album-list>

	<playlist>
		{#if $valueAudioItem?.length}
			<AudioItem {syncSong} />
		{/if}
	</playlist>

	<sync>
		<TimerButton onTimeUpdate={handleTimeUpdate} />
		<p>Elapsed time: {formattedTime}</p>
	</sync>
</container>

<style>
	container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 100px;
		gap: 0px 0px;
		grid-template-areas:
			'albums playlist'
			'sync sync';
		overflow: hidden;
		height: 100%;
	}

	ul {
		padding: 0;
	}

	li {
		list-style: none;
		cursor: pointer;
	}

	album-list {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		grid-area: albums;
		border-right: 1px solid var(--border-color);
	}

	album-list input {
		width: calc(100% - 8px);
	}

	list-container {
		overflow-y: auto;
		overflow-x: hidden;
	}

	playlist {
		display: block;
		grid-area: playlist;
		overflow-y: auto;
		overflow-x: hidden;
	}

	sync {
		display: flex;
		flex-direction: column;
		grid-area: sync;
		margin: 0 8px;
		padding-top: 16px;
		align-items: center;
		border-top: 1px solid var(--border-color);
	}

	sync p {
		margin: 8px;
	}
</style>
