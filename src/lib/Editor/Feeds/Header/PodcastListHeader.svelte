<script>
	import { podcastSearchResults } from '$/editor';
	import { serverUrl } from '$/stores';

	let filterText = '';
	let alignTextLeft = false;

	async function handleFilterTextInput(e) {
		if (e.key === 'Enter' && filterText !== '') {
			let text = filterText;
			e.target.blur();

			$podcastSearchResults.cat = text;
			$podcastSearchResults.feeds = new Array(20).fill({
				image: 'waiting',
				title: ''
			});

			let url = serverUrl + `queryindex?q=${encodeURIComponent(`search/byterm?q=${text}`)}`;

			console.log(url);

			const res = await fetch(url);
			const data = await res.json();
			$podcastSearchResults.feeds = data?.feeds || [];
			$podcastSearchResults = $podcastSearchResults;
		}
	}

	function handleFilterTextSelect(e) {
		e.target.placeholder = '';
		filterText = '';
		alignTextLeft = true;
		// $podcastList = $mainPodcastList;
	}
	function handleFilterTextBlur(e) {
		alignTextLeft = false;
		e.target.placeholder = 'type here to search for your podcast';
		// $podcastListPane === 'subscriptions'
		//   ? 'Filter Subscriptions'
		//   : 'Search For Your Podcast';
		filterText = '';
	}
</script>

<div>
	<input
		type="search"
		bind:value={filterText}
		class:left-text={alignTextLeft}
		placeholder={'type here to search for your podcasts'}
		on:focus={handleFilterTextSelect}
		on:blur={handleFilterTextBlur}
		on:keydown={handleFilterTextInput}
	/>
</div>

<style>
	div {
		display: flex;
		margin-bottom: 0.25em;
	}

	input {
		width: 100%;
		outline: none;
		margin: 0 0.25em;
		border: 1px solid var(--search-border-color);
		text-align: center;
		border-radius: 50px;
	}

	input::placeholder {
		color: var(--secondary-text-color);
		opacity: 1;
	}

	.left-text {
		text-align: left;
	}
</style>
