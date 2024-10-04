<script>
	import { selectedPodcast, podcastList, showSaved, editorDB, remoteServerUrl } from '$/editor';

	let message = '';

	async function addFeed() {
		let feed =
			remoteServerUrl + `/api/queryindex?q=add/byfeedurl?url=${encodeURIComponent(feedUrl)}`;

		console.log(feed);

		const res = await fetch(feed);
		const data = await res.json();
		console.log(data);
		message = data.description;

		if (data.feedId) {
			$selectedPodcast.id = data.feedId;
			$selectedPodcast.url = feedUrl;
			editorDB.setItem('favorites', $podcastList);
			$showSaved = true;
			console.log($selectedPodcast);
		}
	}

	$: feedUrl =
		$selectedPodcast.url === '' || $selectedPodcast?.url?.includes('/blankfeed.xml')
			? ''
			: $selectedPodcast.url;

	// https://tonight-we-are.sfo3.cdn.digitaloceanspaces.com/album-1/feed.xml
</script>

<p>
	After uploading your feed to your server, copy the link to your RSS file here to add your feed to
	the Podcast Index.
</p>
<input class="add-url" type="url" placeholder="Feed Link" bind:value={feedUrl} />
<button class="primary add-feed" on:click={addFeed}>Add Feed</button>
<p class="message">{message}</p>

<style>
	p {
		text-align: center;
		padding: 0;
		margin-bottom: 4px;
	}

	input {
		width: 50px;
		height: 25px;
		margin: 0;
	}

	.add-url {
		width: 100%;
	}

	button.primary.add-feed {
		width: 50%;
		background-image: linear-gradient(to bottom, hsl(0, 100%, 33%), hsl(0, 100%, 23%));
		margin: 8px 25%;
	}

	.message {
		color: hsl(0, 100%, 33%);
		font-size: 1.2em;
		font-weight: 550;
	}
</style>
