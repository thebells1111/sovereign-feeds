<script>
	import { rssData, showSaved, podcastList, editorDB, selectedPodcast } from '$/editor';

	async function updatePubDates() {
		let i = 0;
		$rssData.item.forEach((v) => {
			let d = new Date().getTime() - i * 1000;
			v.pubDate = new Date(d).toUTCString().split(' GMT')[0] + ' +0000';
			i++;
		});
		console.log($rssData);
		$selectedPodcast.rss = $rssData;
		editorDB.setItem('favorites', $podcastList);
		$showSaved = true;
	}
</script>

<p>
	Click here to automatically change the publication dates on all of your songs so the songs are in
	order when displayed in a podcast player.
</p>

<button class="primary add-feed" on:click={updatePubDates}>Update Pub Dates</button>

<style>
	p {
		text-align: center;
		padding: 0;
		margin-bottom: 4px;
	}

	button.primary.add-feed {
		width: 50%;
		background-image: linear-gradient(to bottom, hsl(300, 82%, 35%), hsl(260, 82%, 25%));
		margin: 8px 25%;
	}
</style>
