<script>
	import { onMount } from 'svelte';

	let filteredAlbumsList = [];
	let selectedAlbum = {};
	import AlbumCard from '../AlbumCard.svelte';
	let searchQuery = '';
	let searchInput;
	let activeView;
	export let basePercent = 95;

	import { afterNavigate } from '$app/navigation';
	import { valueAlbumList, valueAudioItem, remoteServerUrl, editingEpisode } from '$/editor';

	$: {
		filteredAlbumsList = $valueAlbumList.filter(
			(obj) =>
				obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				obj.author.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	afterNavigate(({ from }) => {
		setTimeout(() => searchInput.select(), 100);
	});

	onMount(async () => {
		if (!$valueAlbumList.length) {
			const res = await fetch(
				remoteServerUrl +
					`/api/queryindex?q=${encodeURIComponent(
						'podcasts/bymedium?medium=music&max=1000&val=lightning'
					)}`
			);
			let data = await res.json();
			$valueAlbumList = data.feeds || data.feed || [];
			//this removes 100% Retro Live Feed
			$valueAlbumList = sortArrayAlphabetically($valueAlbumList.filter(({ id }) => id !== 5718023));
		}
		console.log($editingEpisode);
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
</script>

<album-list class:hidden={activeView != 'albums'}>
	<input bind:this={searchInput} bind:value={searchQuery} placeholder="filter albums" />
	<list-container>
		<ul>
			{#each filteredAlbumsList as album}
				<li>
					<AlbumCard {album} {basePercent} bind:selectedAlbum />
				</li>
			{/each}
		</ul>
	</list-container>
</album-list>

<style>
	album-list {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	album-list input {
		width: calc(100% - 8px);
	}
</style>
