<script>
	import sortPodcastList from '$functions/sortPodcastList';

	import {
		podcastList,
		mainPodcastList,
		selectedPodcast,
		podcastDB,
		podcastStateDB,
		pinNew,
		podcastListPane,
		seenEpisodesCounts
	} from '$/stores';

	async function subscribe(evt, podcast) {
		if (!evt.target.className.includes('is-subscribed')) {
			evt.target.classList.add('is-subscribed');
			evt.target.innerText = 'Subscribed';
			// $podcastListPane = 'subscriptions';

			console.log(podcast);
			// let databasePodcast = {
			// 	id: podcast.id,
			// 	title: podcast.title,
			// 	artwork: podcast.artwork || podcast.image
			// };

			// let podcastFollows = localStorage.getItem('podcastFollows');
			// if (podcastFollows) {
			// 	podcastFollows = new Set(JSON.parse(podcastFollows));
			// } else {
			// 	podcastFollows = new Set();
			// }
			// podcastFollows.add(podcast.id);
			// localStorage.setItem('podcastFollows', JSON.stringify([...podcastFollows]));

			await podcastDB.setItem(`${podcast.id}`, podcast);
			await markAllAsSeen(podcast);

			try {
				$mainPodcastList.push(podcast);

				$mainPodcastList = sortPodcastList($mainPodcastList, $pinNew);
				$podcastList = [...$mainPodcastList];
			} catch (err) {
				// This code runs if there were any errors.
				console.log(err);
			}
		}
	}

	async function markAllAsSeen(podcast) {
		let seenState = new Set();
		$seenEpisodesCounts[podcast.id] = podcast?.episodes?.length || 0;
		let episodes = podcast?.episodes;
		for (const episode of episodes) {
			seenState.add(episode.id);
		}
		let podcastState = { seen: seenState };
		await podcastStateDB.setItem(`${podcast.id}`, podcastState);
		// $podcastList = $podcastList;
		// $episodesList = $episodesList;
	}
</script>

<button
	class="primary subscribe"
	class:is-subscribed={$mainPodcastList.findIndex(({ id }) => id === $selectedPodcast?.id) > -1}
	on:click={(evt) => subscribe(evt, $selectedPodcast)}
>
	Subscribe
</button>

<style>
	button:hover {
		background-color: black;
		color: white;
	}

	button:active {
		background-color: #333;
		color: #eee;
	}

	.is-subscribed,
	.is-subscribed:hover,
	.is-subscribed:active {
		background-color: transparent;
		border: 1px solid #ddd;
		cursor: default;
	}
</style>
