<script>
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { valueAlbumList, valueAudioItem } from '$/editor';
	let searchQuery = '';
	let searchInput;
	let filteredAlbumsList = [];
	let selectedAlbum = {};
	import AlbumCard from './AlbumCard.svelte';
	import AudioItem from './AudioItem.svelte';
	export let activeValueBlock = {};
	export let syncedTime = 0;
	export let socket;
	export let activeView = 'albums';
	export let isPCValue = true;

	let basePercent = 95;
	let activateOnSync = true;

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
		song.added = syncedTime;
		$valueAudioItem = $valueAudioItem;
	}
</script>

<container>
	<left-pane>
		<left-select>
			<button class="primary album" on:click={() => (activeView = 'albums')}>Show Albums</button>
			<button class="primary value" on:click={() => (activeView = 'valueBlock')}
				>Show Value Block</button
			>
		</left-select>

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

		<active-value class:hidden={activeView != 'valueBlock'}>
			<h2>Active Value Block</h2>

			{#if isPCValue}
				Using Podcaster's Value Block
			{:else if activeValueBlock.meta}
				<active-meta>
					<img src={activeValueBlock.meta.artwork} width="100" height="100" />
					<info>
						<p><b>Song: </b>{activeValueBlock.meta.song}</p>
						<p><b>Artist: </b>{activeValueBlock.meta.author}</p>
						<p><b>Album: </b>{activeValueBlock.meta.album}</p>
					</info>
				</active-meta>

				<h3>Remote Value Block</h3>
				<ul>
					{#each activeValueBlock.remote || [] as item}
						<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
					{/each}
				</ul>

				<h3>Podcaster's Value Block</h3>
				<ul>
					{#each activeValueBlock.base || [] as item}
						<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
					{/each}
				</ul>

				<h3>SF Live</h3>
				<ul>
					<li>({activeValueBlock.sf.split}%) SF Live</li>
				</ul>
			{/if}
		</active-value>
	</left-pane>

	<playlist>
		<label>
			Add new blocks at <input
				class="base-remote-split"
				bind:value={basePercent}
				type="number"
				min="0"
				max="100"
			/>% split
		</label>
		<audio-items>
			{#if $valueAudioItem?.length}
				<AudioItem
					{syncSong}
					bind:activeValueBlock
					{activateOnSync}
					liveproduction="true"
					bind:isPCValue
					{socket}
				/>
			{/if}
		</audio-items>
		<label
			><input type="checkbox" bind:checked={activateOnSync} />Activate Value Block on Sync</label
		>
	</playlist>
</container>

<style>
	container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-template-areas: 'left-pane playlist';
		overflow: hidden;
		flex: 1;
	}

	ul {
		padding: 0;
	}

	li {
		list-style: none;
		cursor: pointer;
	}

	left-pane {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		grid-area: left-pane;
		border-right: 1px solid var(--border-color);
	}
	album-list {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	album-list input {
		width: calc(100% - 8px);
	}

	list-container {
		overflow-y: auto;
		overflow-x: hidden;
	}

	playlist {
		display: flex;
		grid-area: playlist;
		overflow: hidden;
		flex-direction: column;
	}

	playlist label {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 24px;
	}

	playlist label input {
		width: 55px;
		text-align: center;
		margin: 0 0 0 6px;
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

	audio-items {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
	}

	left-select {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
	}

	left-select button {
		margin: 0 16px;
	}

	.hidden {
		display: none;
	}

	.album {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	.value {
		background-image: linear-gradient(to bottom, hsl(253, 100%, 44%), hsl(253, 100%, 26.7%));
	}
</style>
