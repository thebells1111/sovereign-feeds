<script>
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import { rssData, remoteServerUrl, podcastSearchResults, selectedPodcast } from '$/editor';
	import Delete from '$lib/icons/Delete.svelte';
	import AddFeed from './AddFeed.svelte';

	export let reload;

	let publisherFeed = [];
	let showModal = false;
	$: if (reload) {
		publisherFeed = [];
		fetchGuids();
	}

	function handleAddFeed({ feed, episode }) {
		let item = {
			'@_feedGuid': feed.podcastGuid,
			'@_feedUrl': feed.url,
			'@_feedImg': episode?.image || feed.artwork
		};

		if (episode?.guid) {
			item['@_itemGuid'] = episode.guid;
		}

		$rssData['podcast:remoteItem'] = $rssData['podcast:remoteItem'].concat(item);
		$rssData = $rssData;
		publisherFeed = publisherFeed.concat(episode || feed);
		// showModal = false;
	}

	async function fetchGuids() {
		if ($rssData && $rssData['podcast:remoteItem']) {
			let guids = [].concat($rssData['podcast:remoteItem']);
			for (let i = 0; i < guids.length; i++) {
				if (guids[i]['@_feedGuid']) {
					try {
						let item = await fetchEpisodes(guids[i]['@_feedGuid'], guids[i]['@_itemGuid']);
						if (item) {
							publisherFeed[i] = item;
							$rssData['podcast:remoteItem'][i]['@_feedUrl'] = item.url;
						}
					} catch (err) {
						console.error('Error fetching item:', err);
					}
				}
			}
		} else {
			setTimeout(fetchGuids, 500);
		}
	}

	async function fetchEpisodes(guid, itemGuid) {
		try {
			let feedUrl =
				remoteServerUrl +
				`/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
			let episodesUrl =
				remoteServerUrl +
				`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}`)}`;

			let [feedRes, episodesRes] = await Promise.all([fetch(feedUrl), fetch(episodesUrl)]);
			let feedData = await feedRes.json();
			let feed = feedData.feed;

			let episodesData = await episodesRes.json();
			let episodes = episodesData.items;

			if (itemGuid) {
				let foundItem = episodes.find((v) => v.guid === itemGuid);
				if (foundItem) {
					foundItem.url = feed.url;
					return foundItem;
				}
			}

			return feed;
		} catch (err) {
			console.error('Error fetching episodes:', err);
		}
	}

	function addFeed() {
		showModal = true;
	}

	function deleteFeed(index) {
		$rssData['podcast:remoteItem'].splice(index, 1);
		$rssData = $rssData;
		publisherFeed.splice(index, 1);
		publisherFeed = publisherFeed;
	}

	function onClose() {
		showModal = false;
	}
</script>

{#each publisherFeed as item, i}
	<div>
		<img width="60" src={item?.image || item?.artwork} />
		<p>{item?.title}</p>
		<button class="delete" on:click={deleteFeed.bind(this, i)}>
			<Delete size="30" />
		</button>
	</div>
{/each}

<button class="primary" on:click={addFeed}>Add Feed</button>

{#if showModal}
	<Modal bind:showModal {onClose}>
		<!-- <search>
			<SearchBar />
			{#if $podcastSearchResults?.feeds}
				<PodcastSearch {handlePodcastSelect} />
			{/if}
		</search> -->
		<AddFeed {handleAddFeed} />
	</Modal>
{/if}

<style>
	div {
		display: flex;
		align-items: center;
		overflow: hidden;
		width: 100%;
		padding: 4px;
		margin: 0;
		border: none;
		background: transparent;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
		height: auto;
	}

	div > p {
		flex: 1;
	}

	label {
		display: flex;
		flex-direction: column;
	}

	search {
		min-width: 800px;
		width: 100%;
		height: calc(100vh - 100px);
	}

	button.primary {
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
		position: relative;
		margin-top: 8px;
	}

	button.delete {
		background-color: transparent;
		color: rgb(168, 168, 168);
		border: none;
		padding: 0;
		width: 32px;
	}
	button.delete:hover {
		color: red;
	}
</style>
