<script>
	import {
		editingEpisode,
		episodesList,
		editingIndex,
		showLiveEpisodes,
		tagHeaders,
		digitalOceanEnabled,
		trackerDB,
		selectedPodcast
	} from '$/editor';
	import clone from 'just-clone';
	import { selectTextOnFocus } from '$functions/inputActions';
	import Upload from '$lib/Upload/Upload.svelte';

	let episodes = [];
	let warningFlag = -1;
	let badUrl = false;

	$: if ($episodesList && $editingIndex === 0 ? true : $editingIndex) {
		badUrl = false;
		episodes = clone(
			$episodesList.map((v) => {
				return v?.enclosure?.['@_url'];
			})
		);
		episodes.splice($editingIndex, 1);
	}

	$: warningFlag = $showLiveEpisodes
		? -1
		: episodes.findIndex((v) => v === $editingEpisode?.enclosure?.['@_url']);

	const mimeTypes = [
		{ extension: 'm3u8', type: 'application/x-mpegURL' },
		{ extension: 'aac', type: 'audio/aac' },
		{ extension: 'mp3', type: 'audio/mpeg' },
		{ extension: 'oga', type: 'audio/ogg' },
		{ extension: 'opus', type: 'audio/opus' },
		{ extension: 'wav', type: 'audio/wav' },
		{ extension: 'weba', type: 'audio/webm' },
		{ extension: 'ts', type: 'video/mp2t' },
		{ extension: 'mp4', type: 'video/mp4' },
		{ extension: 'mpeg', type: 'video/mpeg' },
		{ extension: 'ogv', type: 'video/ogg' },
		{ extension: 'webm', type: 'video/webm' },
		{ extension: 'avi', type: 'video/x-msvideo' }
	];

	function getDuration(url) {
		// Create a non-dom allocated Audio element
		let a = document.createElement('audio');

		// Define the URL of the MP3 audio file
		a.src = url;

		a.addEventListener('error', function failed(e) {
			console.log(e);
		});

		// Once the metadata has been loaded, display the duration in the console
		a.addEventListener(
			'loadedmetadata',
			function () {
				let duration = a.duration;
				$editingEpisode['itunes:duration'] = Math.round(duration);

				console.log(
					'The duration of the song is of: ' + $editingEpisode['itunes:duration'] + ' seconds'
				);
			},
			false
		);
	}

	async function handleInput() {
		try {
			let size = '33';
			if (!$showLiveEpisodes) {
				const response = await fetch($editingEpisode.enclosure['@_url']);
				if (!response.ok) {
					throw Error(`${response.status} ${response.statusText}`);
				}
				badUrl = false;
				size = response.headers.get('content-length');
				console.log(size);
				getDuration($editingEpisode.enclosure['@_url']);
			}
			$editingEpisode.enclosure['@_length'] = size;

			const mimeData = mimeTypes.find(
				({ extension }) => extension === $editingEpisode.enclosure['@_url'].split('.').pop()
			);
			$editingEpisode.enclosure['@_type'] = mimeData?.type || 'audio/mpeg';
			badUrl = false;
		} catch (error) {
			console.log(error);
			$editingEpisode.enclosure['@_length'] = '';
			$editingEpisode.enclosure['@_type'] = 'audio/mpeg';
			badUrl = true;
		}
	}
	let showUpload = false;
	let fileName;
	$: if (fileName) {
		console.log(fileName);
		$editingEpisode.enclosure['@_url'] = fileName;
	}
</script>

{#if $editingEpisode}
	<div class="episode-enclosure">
		<label>
			<div class="heading">
				<h3>{$tagHeaders.episodes.enclosureUrl}</h3>
				{#if $digitalOceanEnabled}
					<button
						on:click={() => {
							showUpload = true;
						}}
					>
						Upload
					</button>{/if}
				<p>{warningFlag > -1 ? '(duplicate Enclosure)' : ''}</p>
				<p>{badUrl ? "URL doesn't return file" : ''}</p>
			</div>
			<input
				type="text"
				bind:value={$editingEpisode.enclosure['@_url']}
				class:warning={warningFlag > -1}
				use:selectTextOnFocus
				on:input={handleInput}
			/>
		</label>
	</div>
	{#if showUpload}
		<Upload path={`${$editingEpisode.title}/enclosure`} bind:fileName bind:showUpload />
	{/if}
{/if}

<style>
	.episode-enclosure {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0 12px 0 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.heading {
		display: flex;
		margin-bottom: 4px;
	}

	p {
		margin: 0;
		padding: 0;
		color: red;
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 4px;
	}

	.warning,
	.warning:focus {
		outline: 2px solid red;
	}

	button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 2px 8px;
		margin: 0 16px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow:
			inset 0 1px hsla(0, 0%, 42.7%, 1),
			0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow:
			1px 4px 6px rgb(82, 82, 82),
			0 0 0 #000,
			1px 4px 6px rgb(82, 82, 82);
	}
</style>
