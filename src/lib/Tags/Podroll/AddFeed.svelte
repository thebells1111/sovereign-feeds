<script>
	import { XMLParser } from 'fast-xml-parser';
	import { remoteServer } from '$/stores';
	import AddBlocksIcon from '$lib/icons/AddBlocks.svelte';
	export let addFeed = () => {};
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
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/search/byterm?q=${indexQuery}`)}`;

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
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
		let episodesUrl =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}`)}`;

		Promise.all([fetch(feedUrl), fetch(episodesUrl)])
			.then(async ([feedRes, episodesRes]) => {
				let data = await feedRes.json();
				let feed = data.feed;

				const res = await fetch(remoteServer + '/api/proxy?url=' + encodeURIComponent(feed.url), {
					headers: { 'User-Agent': 'TheSplitKit/0.1' }
				});
				const xml = await res.text();
				if (!xml.includes('<rss')) throw new Error('Not XML');

				let liveItems;
				if (/podcast:liveitem/i.test(xml)) {
					const options = {
						ignoreAttributes: false
					};
					const parser = new XMLParser(options);
					let xmlObj = parser.parse(xml);

					let tempItems = xmlObj?.rss?.channel?.['podcast:liveItem'];
					tempItems = tempItems ? [].concat(tempItems) : tempItems;
					liveItems = tempItems?.map((v) => {
						let feed = {
							title: v.title,
							author: v['itunes:author'],
							image: v?.image?.url,
							artwork: v?.['itunes:image']?.['@_href'],
							description: v.description,
							value: {
								type: 'lightning',
								method: 'keysend',
								destinations: []
							}
						};

						if (v?.['podcast:value']) {
							feed.value = {};
							feed.value.type = v?.['podcast:value']?.['@_type'];
							feed.value.method = v?.['podcast:value']?.['@_method'];
							feed.value.destinations = removeAtSign(
								v?.['podcast:value']?.['podcast:valueRecipient']
							);
						}

						return feed;
					});
				}

				let episodesData = await episodesRes.json();
				let episodes = [].concat(
					liveItems ? liveItems : [],
					episodesData.items ? episodesData.items : []
				);

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

<fetch-feed>
	<mobile-top>
		<input bind:value={indexQuery} on:keydown={handleEnter} placeholder="search for podcast" />
	</mobile-top>
	<button class="search" on:click={searchPodcastIndex}>Search Directory</button>
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

{#if selectedFeed.title}
	<feed-header>
		<h3>Podcast</h3>
	</feed-header>
	<selected-feed>
		<feed-info>
			<img
				src={selectedFeed?.artwork || selectedFeed?.image}
				alt={selectedFeed?.title}
				width="40"
				height="40"
			/>
			<p>{selectedFeed.title}</p>
			<button on:click={addFeed.bind(this, selectedFeed, 'podcast')} class="add-icon">
				<AddBlocksIcon size="24" />
			</button>
		</feed-info>
	</selected-feed>
{/if}

{#if episodeResults.length}
	<h3>Episodes</h3>
	<ul>
		{#each episodeResults as episode}
			<li class="pi-result">
				<card>
					<img
						src={episode?.artwork || episode?.image || selectedFeed?.artwork || selectedFeed?.image}
						alt={episode?.title}
						width="40"
						height="40"
					/>
					<p>{episode?.title}</p>
					<button on:click={addFeed.bind(this, episode, 'podcast', selectedFeed)} class="add-icon">
						<AddBlocksIcon size="24" />
					</button>
				</card>
			</li>
		{/each}
	</ul>
{/if}

<style>
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
		align-items: flex-end;
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
		background-color: hsl(38, 100%, 93%);
	}

	feed-info p {
		margin: 0;
	}

	.search {
		margin-bottom: 8px;
	}

	button.add-icon {
		color: var(--color-text-0);
		background-color: hsl(38, 100%, 61%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
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
