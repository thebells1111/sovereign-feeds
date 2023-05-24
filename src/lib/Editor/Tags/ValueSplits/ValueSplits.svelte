<script>
	import io from 'socket.io-client';
	import { valueAudioItem, editingEpisode, showLiveEpisodes, selectedPodcast } from '$/editor';
	import getRSSEditorFeed from '$lib/Editor/_functions/getRSSFeed';
	import PreProduction from './PreProduction.svelte';
	import PostProdcution from './PostProdcution.svelte';
	import LiveProduction from './LiveProduction.svelte';
	import TimerButton from './TimerButton.svelte';
	let activeValueBlock = {};
	let liveView = 'albums';
	let isPCValue = true;
	let socket;
	let showSocketConnect = false;
	let showMismatchedFeeds = false;

	$: viewer = $showLiveEpisodes ? 'live' : 'pre';

	let previousEditingEpisodeLink = $editingEpisode?.['@_liveValueLink'];
	let timeoutId;
	let timeoutTime = 10000; // 10 seconds

	$: {
		if ($editingEpisode?.['@_liveValueLink'] !== previousEditingEpisodeLink) {
			// Clear any existing timer
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				handleNewEpisode($showLiveEpisodes, $editingEpisode?.['@_liveValueLink']);
			}, timeoutTime);
			previousEditingEpisodeLink = $editingEpisode?.['@_liveValueLink'];
		}
	}

	// Reactive statement to handle $showLiveEpisode changes
	$: if ($showLiveEpisodes) {
		handleNewEpisode($editingEpisode?.['@_liveValueLink']);
	}

	async function handleNewEpisode(editingEpisodeLink) {
		showSocketConnect = false;
		showMismatchedFeeds = false;
		if ($showLiveEpisodes && $selectedPodcast?.url) {
			let xml = await getRSSEditorFeed($selectedPodcast.url);
			let activeItem = [].concat(xml?.rss?.channel?.['podcast:liveItem']).find((v) => {
				return v?.['@_liveValueLink'] === editingEpisodeLink;
			});
			showSocketConnect = activeItem?.['@_liveValueLink']?.includes(
				'https://curiohoster.com/event'
			);
			showMismatchedFeeds = !showSocketConnect;
		}
		if (socket) {
			socket.disconnect();
			socket = undefined;
			console.log('Socket disconnected');
		}
	}

	$: updateEditingEpisode($valueAudioItem);

	function updateEditingEpisode() {
		if ($editingEpisode) {
			$editingEpisode.valueAudioItem = $valueAudioItem;
		}
	}

	let formattedTime = '00:00:00:00';
	let syncedTime = 0;

	function handleTimeUpdate(value) {
		syncedTime = value;
		let hours = Math.floor(value / 3600);
		let minutes = Math.floor((value % 3600) / 60);
		let seconds = Math.floor(value % 60);
		let ms = Math.floor((value % 1) * 100);
		formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
	}

	function handlePCValue() {
		liveView = 'valueBlock';
		activeValueBlock = {};
		isPCValue = true;
		let valueGuid = $editingEpisode?.['@_liveValueLink'].split('?event_id=')[1];
		socket.emit('valueBlock', { valueGuid, serverData: {} });
	}

	function socketConnect() {
		// $editingEpisode['@_liveValueLink'] =
		// 	'http://localhost:8000/event?event_id=b1ddabe6-cb0d-4906-a25e-c3bc4afb0ba9';
		let valueGuid = $editingEpisode?.['@_liveValueLink']?.split('event_id=')[1];
		socket = io(remoteServerUrl + '/event?event_id=' + valueGuid, { withCredentials: true });

		socket.on('connect', () => {
			if (valueGuid) {
				// Send a message with the valueGuid
				socket.emit('connected', valueGuid);
			} else {
				console.log('ValueGuid is not defined');
			}
		});
	}
</script>

<button-container>
	{#if $showLiveEpisodes}
		<button class="primary live" on:click={() => (viewer = 'live')}>Live Production</button>
	{:else}
		<button
			class="primary pre"
			on:click={() => {
				viewer = 'pre';
			}}>Pre Production</button
		>
	{/if}
	<button
		class="primary"
		on:click={() => {
			viewer = 'post';
		}}>Post Production</button
	>
</button-container>
<div>
	{#if viewer === 'pre'}
		<PreProduction bind:syncedTime />
	{:else if viewer === 'post'}
		<PostProdcution />
	{:else if viewer === 'live'}
		<LiveProduction
			bind:syncedTime
			bind:activeValueBlock
			activeView={liveView}
			bind:isPCValue
			{showSocketConnect}
			{socketConnect}
			{socket}
			{handleNewEpisode}
			{showMismatchedFeeds}
		/>
	{/if}

	<bottom class:hidden={viewer === 'post'}>
		<button class="primary pc-value" on:click={handlePCValue}
			>Activate Podcaster's <br /> Value Block</button
		>
		<sync>
			<TimerButton onTimeUpdate={handleTimeUpdate} />
			<p>Elapsed time: {formattedTime}</p>
		</sync>
	</bottom>
</div>

<style>
	div {
		height: calc(100% - 45px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	button-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button-container > button {
		margin: 0 16px 8px 16px;
	}

	.pre {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	.live {
		background-image: linear-gradient(to bottom, hsla(277, 100%, 33%, 1), hsla(277, 100%, 16%, 1));
	}

	bottom {
		display: flex;
		justify-content: space-between;
		padding-top: 16px;
		border-top: 1px solid var(--border-color);
	}
	sync {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 8px;
	}

	bottom p {
		padding: 0;
	}

	.hidden {
		display: none;
	}

	.pc-value {
		width: 200px;
		height: 56px;
		background-image: linear-gradient(to bottom, hsl(9, 100%, 44%), hsla(9, 100%, 26.7%, 1));
		margin-left: 8px;
	}
</style>
