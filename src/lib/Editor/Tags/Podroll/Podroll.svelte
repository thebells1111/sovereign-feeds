<script>
	import Modal from '$lib/Modals/Modal/Modal.svelte';
	import { rssData, remoteServerUrl, podcastSearchResults, selectedPodcast } from '$/editor';
	import PodcastSearch from '$lib/Editor/Feeds/PodcastSearch.svelte';
	import SearchBar from '$lib/Editor/Feeds/Header/PodcastListHeader.svelte';
	import Delete from '$lib/icons/Delete.svelte';

	export let podcastInfoPage;
	let roll = [];

	let showModal = false;

	$: if (podcastInfoPage === 'podroll') {
		roll = [];
		fetchGuids();
	}

	function handlePodcastSelect(podcast) {
		console.log(podcast);
		$rssData['podcast:podroll']['podcast:remoteItem'] = (
			$rssData?.['podcast:podroll']?.['podcast:remoteItem'] || []
		).concat({ '@_feedGuid': podcast.podcastGuid, '@_feedUrl': podcast.url });
		roll = roll.concat(podcast);
		showModal = false;
		onClose();
	}

	function onClose() {
		$podcastSearchResults = {};
	}

	async function fetchGuids() {
		if ($rssData && $rssData?.['podcast:podroll']?.['podcast:remoteItem']) {
			let guids = [].concat($rssData?.['podcast:podroll']?.['podcast:remoteItem']);
			console.log(guids);
			for (let i = 0; i < guids.length; i++) {
				console.log($selectedPodcast.title);
				if (guids[i]?.['@_feedGuid']) {
					const feedGuidUrl =
						remoteServerUrl +
						`/api/queryindex?q=${encodeURIComponent(
							`/podcasts/byguid?guid=${guids[i]?.['@_feedGuid']}`
						)}`;
					let res = await fetch(feedGuidUrl);
					let data = await res.json();
					console.log(data);
					roll[i] = data.feed;
					$rssData['podcast:podroll']['podcast:remoteItem'][i]['@_feedUrl'] = data.feed.url;

					console.log(data);
				}
			}
		} else {
			setTimeout(fetchGuids, 500);
		}
	}

	function addRoll() {
		showModal = true;
	}

	function deleteRoll(index) {
		$rssData['podcast:podroll']['podcast:remoteItem'].splice(index, 1);
		roll.splice(index, 1);
		roll = roll;
	}
</script>

{#each roll as item, i}
	<div>
		<img width="60" src={item.artwork} />
		<p>{item.title}</p>
		<button class="delete" on:click={deleteRoll.bind(this, i)}>
			<Delete size="30" />
		</button>
	</div>
{/each}

<button class="primary" on:click={addRoll}>Add Podcast</button>

{#if showModal}
	<Modal bind:showModal {onClose}>
		<search>
			<SearchBar />
			{#if $podcastSearchResults?.feeds}
				<PodcastSearch {handlePodcastSelect} />
			{/if}
		</search>
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
