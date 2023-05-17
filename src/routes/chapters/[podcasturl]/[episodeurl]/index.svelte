<script context="module">
	export async function load({ params, fetch }) {
		let podcasturl = params.podcasturl;
		let episodeurl = params.episodeurl;
		let { chapters, episode, title } = await getChapters();

		return {
			props: {
				podcast: podcasturl,
				enclosure: episodeurl,
				chapters: chapters,
				episode: episode,
				title: title
			}
		};

		function getChapters() {
			if (podcasturl) {
				return new Promise(async (resolve, reject) => {
					const res1 = await fetch(`/api/rsscreator?url=${encodeURIComponent(podcasturl)}`);
					const feed = await res1.json();
					let episodes = feed?.rss?.channel?.item;
					let selectedEpisode = episodes?.find(({ enclosure }) => {
						return enclosure?.['@_url'] === episodeurl;
					});
					let chapters = [
						{
							title: '',
							url: '',
							img: '',
							startTime: 0
						}
					];
					let title = feed?.rss?.channel?.title;
					try {
						let chaptersUrl = selectedEpisode?.['podcast:chapters']?.['@_url'];
						if (chaptersUrl) {
							let res2 = await fetch(
								remoteServerUrl + `/api/proxy?url=` + encodeURIComponent(chaptersUrl)
							);
							let json = await res2.json();
							chapters = json.chapters;
						}
						resolve({ chapters: chapters, episode: selectedEpisode, title: title });
					} catch (error) {
						resolve({
							chapters: chapters,
							episode: selectedEpisode,
							title: title
						});
					}
				});
			}
		}
	}
</script>

<script>
	import { saveAs } from 'file-saver';
	import { browser } from '$app/env';
	import ChaptersEditor from './_components/ChapterEditor.svelte';
	import ChapterImage from './_components/ChapterImage.svelte';
	import AudioPlayer from '$lib/Shared/Player/AudioPlayer.svelte';
	import Saved from '$lib/Modals/Saved/Saved.svelte';
	import ServerSending from '$lib/Modals/ServerSending/ServerSending.svelte';
	import CloudUpload from '$lib/icons/CloudUpload.svelte';

	import convertTime from '$functions/convertTime';
	import { onMount, tick, onDestroy } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import {
		chaptersDB,
		showSaved,
		showServerSending,
		showServerSendingErrorMsg,
		podpingMessage,
		remoteServerUrl
	} from '$/editor';
	import { player, playingEpisodeChapters, chapterIndex, loggedIn } from '$/stores';
	import PlayerDisplay from '$lib/Editor/5-Player/PlayerDisplay.svelte';
	import SaveIcon from '$lib/icons/Save.svelte';
	import CancelFilledIcon from '$lib/icons/CancelFilled.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import DownloadIcon from '$lib/icons/Download.svelte';

	export let chapters = [];
	$playingEpisodeChapters = [];
	export let enclosure;
	export let podcast;
	export let episode;
	export let title;
	let notSaved = false;
	let editingIndex = 0;

	async function fetchChapters() {
		if (browser) {
			let res = await fetch(
				remoteServerUrl +
					'/api/sf/savechapters?link=' +
					encodeURIComponent(`${podcast}||${enclosure}`),
				{
					credentials: 'include'
				}
			);
			let data = await res.json();
			// console.log(data);

			$playingEpisodeChapters = data.chapters.length ? data.chapters : [...chapters];
		}
	}

	$: fetchChapters($loggedIn);
	onMount(async () => {
		if ($loggedIn) {
			await fetchChapters();
		} else {
			$playingEpisodeChapters = [...chapters];
		}
		await tick();
		notSaved = false;
	});

	onDestroy(() => {
		$player = null;
	});

	$: setNotSaved($playingEpisodeChapters);

	function setNotSaved() {
		notSaved = true;
	}

	function getUniqueListBy(arr, key) {
		return [...new Map(arr.map((item) => [item[key], item])).values()];
	}

	function markChapter() {
		let time = $player.currentTime;
		$playingEpisodeChapters = getUniqueListBy(
			$playingEpisodeChapters.concat({
				title: '',
				url: '',
				img: '',
				startTime: time
			}),
			'startTime'
		).sort(function (a, b) {
			return a.startTime - b.startTime;
		});

		$chapterIndex = $playingEpisodeChapters.findIndex(({ startTime }) => startTime === time);

		showEditor = $chapterIndex > -1;
	}

	let showEditor = false;
	let showLogin = false;

	async function saveChapters() {
		if ($loggedIn) {
			let data = {
				chapterLink: `${podcast}||${enclosure}`,
				chapterContent: $playingEpisodeChapters
			};
			let res = await fetch(remoteServerUrl + '/api/sf/savechapters', {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			let chaptersData = await res.json();

			notSaved = false;
			$showSaved = true;
		} else {
			showLogin = true;
			setTimeout(() => {
				showLogin = false;
			}, 1500);
		}
	}

	async function deleteChapter(i) {
		let text = `Are you sure you want to delete this "${$playingEpisodeChapters[i].title}"?`;
		if (confirm(text) == true) {
			$playingEpisodeChapters.splice(i, 1);
			$playingEpisodeChapters = $playingEpisodeChapters;
		}
	}

	beforeNavigate(({ from, to, cancel }) => {
		if (notSaved) {
			if (to) {
				if (
					confirm(
						'Changes you made may not be saved. \r\n \r\nPress OK to continue with UNSAVED changes.'
					)
				) {
					window.location.href = to.href;
				} else {
					cancel();
				}
			} else {
				cancel();
			}
		}
	});

	//prevents errors if chapterIndex is ever -1
	$: $chapterIndex = $chapterIndex > 0 ? $chapterIndex : 0;

	let chapterElements = [];

	function scrollToChapter(index) {
		chapterElements[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	$: scrollToChapter($chapterIndex);

	function downloadChapters() {
		chaptersDB.setItem(`${podcast}||${enclosure}`, chapters);
		notSaved = false;

		let c = {};
		c.version = '1.2.0';
		c.chapters = $playingEpisodeChapters;
		var blob = new Blob([JSON.stringify(c)], { type: 'text/plain;charset=utf-8' });
		let slug = `${episode.title ? episode.title : 'Episode'} Chapters`.replace(
			/([^a-z0-9\s]+)/gi,
			''
		);
		saveAs(blob, slug.toLowerCase().split(' ').join('_') + '.json');
	}

	async function serverPush() {
		$podpingMessage = '';
		$showServerSending = true;
		try {
			if (title) {
				let res = await fetch(remoteServerUrl + '/api/sf/serverpush', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ chapters: $playingEpisodeChapters, title: title }),
					credentials: 'include'
				});
				if (res.status !== 200) {
					throw `Server Response Code ${res.status}`;
				}
				try {
					let data = await res.json();

					console.log(data);

					$showServerSendingErrorMsg = data.message || 'Chapters Submitted Successfully';
				} catch (error) {
					throw 'Improper JSON response';
				}
			}
		} catch (error) {
			console.log(error);
			if (error === 'Improper JSON response') {
				$showServerSendingErrorMsg = 'Improper JSON response from Server';
			} else if (typeof error === 'string' && error?.includes('Server Response Code')) {
				let code = error?.split('Server Response Code ')?.[1];
				$showServerSendingErrorMsg = `Response Code ${code} received from Server`;
			} else {
				$showServerSendingErrorMsg = `Unknown Error sending to Server<br/><br/>Check your Chapters Link and Secret`;
			}
		}
	}
</script>

<svelte:window />

<div class="container">
	<div class="edit-bar">
		<button class="icon add" on:click={markChapter}><CancelFilledIcon size="60" /></button>
		<button class="icon download" on:click={downloadChapters}><DownloadIcon size="36" /></button>
		<button class="icon upload" on:click={serverPush}><CloudUpload size="36" /></button>
		<button class="icon save" on:click={saveChapters}><SaveIcon size="36" /></button>
	</div>
	<ul>
		{#each $playingEpisodeChapters as chapter, i}
			<li
				bind:this={chapterElements[i]}
				on:click={() => {
					showEditor = true;
					editingIndex = i;
				}}
				class:active={$chapterIndex === i}
			>
				<ChapterImage {chapter} small={true} />
				<div class="middle">
					<p class:link={chapter.url}>{chapter.title || 'Untitled Chapter'}</p>
				</div>

				<div class="delete-container">
					<button class="icon delete" on:click|stopPropagation={deleteChapter.bind(this, i)}>
						<Delete size="20" />
					</button>
					<div class="time">{convertTime(chapter.startTime)}</div>
				</div>
			</li>
		{/each}
	</ul>
	{#if showLogin}
		<h2 class="login-warning" class:show={showLogin}>Please Log In to Save!</h2>
	{/if}
	<AudioPlayer {enclosure} />
	<PlayerDisplay {$playingEpisodeChapters} />
</div>

<ChaptersEditor
	bind:showEditor
	bind:chapters={$playingEpisodeChapters}
	bind:chapter={$playingEpisodeChapters[editingIndex]}
/>

{#if $showSaved}
	<Saved />
{/if}

{#if $showServerSending}
	<ServerSending />
{/if}

<style>
	.container {
		width: 100%;
		height: 100%;
		background-color: white;
		overflow: hidden;
	}

	.edit-bar {
		display: flex;
		justify-content: space-between;
		margin: 4px auto;
		height: 46px;
		width: calc(100% - 16px);
		max-width: 720px;
	}

	h2 {
		margin: 0;
	}

	ul {
		padding: 8px;
		width: calc(100% - 16px);
		height: calc(100% - 126px);
		max-width: 720px;
		background-color: #ffffff;
		overflow: auto;
		margin: 0 auto;
	}

	li {
		width: 100%;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		padding: 4px;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	p {
		padding: 0;
	}

	.middle {
		flex-grow: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 8px;
	}

	.link {
		font-weight: 700;
		text-decoration: underline;
		color: rgb(0, 117, 156);
	}
	.time {
		flex-grow: 0;
		padding: 8px;
	}

	.active {
		background-color: hsl(210deg 100% 98%);
	}

	.icon {
		display: grid;
		place-content: center;
		background-color: transparent;
		border: none;
		margin: 0;
		cursor: pointer;
	}

	.add {
		color: hsl(234, 100%, 32%);
		background-color: white;
		transform: rotate(45deg);
		width: 50px;
		height: 50px;
		border-radius: 50px;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		position: absolute;
		bottom: 98px;
		right: 20px;
		z-index: 3;
	}

	.delete-container {
		display: flex;
		flex-direction: column;
	}

	.delete {
		color: rgb(168, 168, 168);
		display: flex;
		justify-content: flex-end;
	}

	.delete:hover {
		color: red;
	}

	.login-warning {
		position: absolute;
		color: red;
		top: 55px;
		left: calc(50% - 150px);
		width: 300px;
		text-align: center;
		display: inline-block;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		padding: 8px 0;
		border-radius: 8px;
		opacity: 0;
		transition: opacity 1s;
		cursor: default;
		user-select: none;
	}

	.login-warning.show {
		opacity: 1;
		transition: opacity 0.5s;
	}
</style>
