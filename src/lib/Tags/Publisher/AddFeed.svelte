<script>
	import { remoteServerUrl } from '$/editor';
	export let handleAddFeed = () => {};
	let selectedFeed = {};
	let selectedEpisode = {};
	let showEpisode = false;
	let podcastIndexSearchResults = [];
	let episodeResults = [];

	let indexQuery = '';
	// indexQuery = 'podcasting 2.0';

	async function searchPodcastIndex() {
		selectedFeed = {};
		selectedEpisode = {};
		let url =
			remoteServerUrl + `/api/queryindex?q=${encodeURIComponent(`/search/byterm?q=${indexQuery}`)}`;

		const res = await fetch(url);
		let data = await res.json();

		try {
			console.log(data);
			episodeResults = [];

			podcastIndexSearchResults = data.feeds || [];
			console.log(podcastIndexSearchResults);
		} catch (error) {}
	}

	function fetchEpisodes(guid) {
		let feedUrl =
			remoteServerUrl + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
		let episodesUrl =
			remoteServerUrl +
			`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}`)}`;

		Promise.all([fetch(feedUrl), fetch(episodesUrl)])
			.then(async ([feedRes, episodesRes]) => {
				let data = await feedRes.json();
				let feed = data.feed;

				let episodesData = await episodesRes.json();
				let episodes = [].concat(episodesData.items ? episodesData.items : []);

				feed.item = episodes;

				episodeResults = feed.item || [];
				selectedFeed = feed;
			})
			.catch((err) => {
				console.error('Error fetching episodes:', err);
			});
	}

	function handleEnter(event) {
		if (event.key === 'Enter') {
			searchPodcastIndex(indexQuery);
		}
	}

	function isValidUrl(url) {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // fragment locator
		return !!pattern.test(url);
	}

	function removeAtSign(data) {
		let dataArray = [].concat(data);

		let cleanedData = dataArray.map((item) => {
			const newItem = {};

			for (let key in item) {
				const newKey = key.replace('@_', ''); // Creates new key without '@_'
				newItem[newKey] = item[key];
			}

			return newItem;
		});

		return cleanedData;
	}
</script>

<container>
	<fetch-feed>
		<mobile-top>
			<input bind:value={indexQuery} on:keydown={handleEnter} placeholder="search for podcast" />
		</mobile-top>
		<button class="search primary" on:click={searchPodcastIndex}>Search Directory</button>
	</fetch-feed>

	{#if podcastIndexSearchResults.length && !episodeResults.length}
		<ul>
			{#each podcastIndexSearchResults as feed}
				<li class="pi-result" on:click={fetchEpisodes.bind(this, feed?.podcastGuid)}>
					<card>
						<img src={feed?.artwork || feed?.image} alt={feed?.title} width="40" height="40" />
						{feed?.title}
					</card>
				</li>
			{/each}
		</ul>
	{/if}

	{#if selectedFeed?.title}
		<h3>Podcast</h3>
		<selected-feed>
			<feed-info>
				<img
					src={selectedFeed?.artwork || selectedFeed?.image}
					alt={selectedFeed?.title}
					width="40"
					height="40"
				/>
				<p>{selectedFeed.title}</p>
				<button
					on:click={handleAddFeed.bind(this, { feed: selectedFeed })}
					class="add-icon primary"
				>
					Add
				</button>
			</feed-info>
		</selected-feed>
	{/if}

	{#if episodeResults?.length}
		<h3>Episodes</h3>
		<ul>
			{#each episodeResults as episode}
				<li class="pi-result">
					<card>
						<img
							src={episode?.artwork ||
								episode?.image ||
								selectedFeed?.artwork ||
								selectedFeed?.image}
							alt={episode?.title}
							width="40"
							height="40"
						/>
						<p>{episode?.title}</p>
						<button
							on:click={handleAddFeed.bind(this, { episode, feed: selectedFeed })}
							class="add-icon primary"
						>
							Add
						</button>
					</card>
				</li>
			{/each}
		</ul>
	{/if}
</container>

<style>
	container {
		width: 100vw;
		max-width: 500px;
		height: calc(100vh - 96px);
	}
	fetch-feed {
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	mobile-top {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		min-height: 58px;
	}

	input {
		margin-left: 8px;
		width: 100%;
	}

	ul {
		padding: 0;
		flex: 1;
		overflow: auto;
		margin: 0 8px;
		width: calc(100% - 16px);
	}

	li {
		list-style: none;
		padding: 0;
		width: 100%;
	}

	.pi-result {
		display: flex;
		align-items: center;
	}

	h3 {
		text-align: center;
	}

	card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		width: 100%;
		margin: 4px 8px;
	}

	img {
		border: 1px solid gray;
		margin-right: 0.5em;
	}
	h3 {
		margin: 0;
	}

	feed-header {
		display: flex;
		margin: 8px 0 4px 8px;
		align-items: center;
		justify-content: center;
	}

	selected-feed {
		display: flex;
		margin: 0 8px 16px 8px;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 16px);
	}

	feed-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		width: calc(100% - 16px);
		margin: 4px 8px;
	}

	feed-info p {
		margin: 0;
	}

	.search {
		margin: 0 0 8px 8px;
	}

	button.add-icon {
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		width: 50px;
		border-radius: 25px;
		padding: 0;
	}

	@media (max-width: 799px) {
		fetch-feed {
			width: 100%;
			flex-direction: column;
			margin: 0;
		}

		mobile-top {
			width: calc(100% - 16px);
			min-height: 58px;
		}
		fetch-feed button {
			margin-top: 8px;
			width: 75%;
		}

		selected-feed {
			flex-direction: column;
		}
	}
</style>
