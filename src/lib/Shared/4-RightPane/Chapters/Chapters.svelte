<script>
	import convertTime from '$functions/convertTime';
	import Image from '$functions/Image.svelte';

	import {
		selectedEpisode,
		selectedPodcast,
		playingEpisode,
		player,
		playerTime,
		selectedEpisodeChapters,
		playingEpisodeChapters,
		chapterIndex,
		middlePane,
		playerSaveTime,
		showNotesVerticalSwiper
	} from '$/stores';

	export let showChapters = false;
	let imageSizer = '&w=480&h=480';

	$: if ($selectedEpisode && $selectedEpisode.chaptersUrl) {
		getChapters($selectedEpisode.chaptersUrl, 'selected');
	} else {
		$selectedEpisodeChapters = null;
	}

	$: if ($playingEpisode && $playingEpisode.chaptersUrl) {
		getChapters($playingEpisode.chaptersUrl, 'playing');
	} else {
		$playingEpisodeChapters = null;
	}

	async function getChapters(url, selector) {
		let y;
		if (url) {
			let res = await fetch(`/api/httpsproxy?url=` + encodeURIComponent(url));
			y = await res.json();
		}
		if (selector === 'selected') {
			$selectedEpisodeChapters = y.chapters;
		}
		if (selector === 'playing') {
			$playingEpisodeChapters = y.chapters;
		}
	}

	async function updatePlayingChapters() {
		let response = await fetch(
			`/api/httpsproxy?url=` + encodeURIComponent($playingEpisode.chaptersUrl)
		);
		let data = await response.json();

		$playingEpisodeChapters = data.chapters;
	}

	function jumpToChapter(chapter, index) {
		showChapters = false;
		if ($playingEpisode.id === $selectedEpisode.id) {
			if (chapter.startTime) {
				$playerTime = chapter.startTime;
				$player.currentTime($playerTime);
				$chapterIndex = index;
				$playerSaveTime = 0;
			}
			$middlePane = 'nowPlaying';
		}
	}

	let yScroll = 0;
	let yPosStart;
	let scrollTopStart;
</script>

{#if $selectedEpisodeChapters}
	<ul
		on:scroll={(e) => {
			yScroll = e.target.scrollTop;
		}}
		on:touchstart={(e) => {
			let touch = e.touches[0] || e.changedTouches[0];
			yPosStart = touch.pageY;
			$showNotesVerticalSwiper.allowTouchMove = false;
			scrollTopStart = yScroll;
		}}
		on:touchmove={(e) => {
			let touch = e.touches[0] || e.changedTouches[0];
			if (scrollTopStart === 0 && yPosStart < touch.pageY) {
				$showNotesVerticalSwiper.allowTouchMove = true;
			}
		}}
		on:touchend={() => {
			$showNotesVerticalSwiper.allowTouchMove = true;
		}}
	>
		{#each $selectedEpisodeChapters as chapter, index}
			<li
				on:click={jumpToChapter.bind(this, chapter, index)}
				class:active={$playingEpisode.id === $selectedEpisode.id && index === $chapterIndex}
			>
				<div class="img-container">
					<!-- svelte-ignore a11y-img -->
					<Image
						alt="chapter"
						src={chapter?.img ||
							$selectedEpisode?.image ||
							$selectedPodcast?.artwork ||
							$selectedPodcast?.image}
						style={`height: 100%;	width: 100%;`}
					/>
				</div>
				<p class="title">{chapter.title}</p>
				<p class="time">{convertTime(chapter.startTime)}</p>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		padding: 0;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 3px 0;
		border-bottom: 1px solid #ddd;
	}

	.active {
		background-color: rgba(0, 0, 0, 0.05);
		font-weight: 500;
	}

	.img-container {
		height: 60px;
		width: 60px;
		min-width: 60px;
		background-color: lightgray;
	}

	p {
		padding: 0 0 0 8px;
	}

	p.title {
		width: 100%;
	}

	p.time {
		padding-right: 8px;
	}
</style>
