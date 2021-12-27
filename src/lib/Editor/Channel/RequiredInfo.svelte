<script>
	import Title from './Components/Title/Title.svelte';
	import Description from './Components/Description/Description.svelte';
	import Categories from './Components/Categories/Categories.svelte';
	import { rssData, selectedPodcast, tagHeaders, podcastList } from '$/editor';

	// function checkLocked() {
	// 	if (!$rssData['podcast:locked']) {
	// 		$rssData['podcast:locked'] = {
	// 			'#text': 'no',
	// 			'@_owner': ''
	// 		};
	// 		locked = false;
	// 	} else {
	// 		let text = $rssData['itunes:owner']['itunes:email'] ? 'yes' : 'no';
	// 		let owner = $rssData?.['itunes:owner']?.['itunes:email'] || '';

	// 		if (text === 'no') {
	// 			owner = '';
	// 		}

	// 		locked = text === 'yes' ? true : false;

	// 		$rssData['podcast:locked'] = {
	// 			'#text': text,
	// 			'@_owner': owner
	// 		};
	// 	}
	// }

	// $: if ($rssData) {
	// 	checkLocked();
	// }

	// $: console.log($rssData);

	// function handleEmail() {
	// 	if (locked) {
	// 		$rssData['podcast:locked']['@_owner'] = $rssData?.['itunes:owner']?.['itunes:email'] || '';
	// 	}
	// 	console.log($rssData);
	// }
	// function handleLock(e) {
	// 	console.log(locked);
	// 	$rssData['podcast:locked']['#text'] = locked ? 'yes' : 'no';
	// 	if (locked) {
	// 		$rssData['podcast:locked']['@_owner'] = $rssData?.['itunes:owner']?.['itunes:email'] || '';
	// 	} else {
	// 		$rssData['podcast:locked']['@_owner'] = '';
	// 	}

	// 	console.log($rssData['podcast:locked']);
	// }
</script>

{#if $rssData}
	<Title />

	<Description />
	<label>
		<h3>{$tagHeaders.podcast.link} (required)</h3>
		<input type="text" bind:value={$rssData.link} />
	</label>

	<Categories />

	<!-- <label class="locked">
		<input type="checkbox" bind:checked={locked} on:change={handleLock} />
		Podcast Locked
	</label> -->
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
