<script>
	import {
		player,
		playerTime,
		playerDuration,
		playingEpisodeChapters,
		chapterIndex,
		swiper,
		playerSaveTime,
		playingEpisode
	} from '$/stores';

	let progress;
	let handle;
	let trackMouse = false;
	let trackPosition;
	export let trackerColor = '#777';
	export let elapsedColor = '#fff';
	export let handleColor = '#fff';
	let trackerHeight = 2;
	let handleHeight = 8;
	$: percentage = ($playerTime / $playerDuration) * 100;
	let storedTimeUpdate;

	function handleProgress(e) {
		storedTimeUpdate = $player.ontimeupdate;
		// handleHeight = handleHeight * 2;
		$player.ontimeupdate = () => null;
		trackMouse = true;
		trackPosition = e.x;

		if (e.target !== handle) {
			$playerTime = (e.offsetX / progress?.clientWidth) * $playerDuration;
		}
	}

	function handleTouchstart(e) {
		let touch = e.touches[0];
		storedTimeUpdate = $player.ontimeupdate;
		// handleHeight = handleHeight * 2;
		$player.ontimeupdate = () => null;
		trackMouse = true;
		trackPosition = touch.clientX;
		console.log(touch);

		if (e.target !== handle) {
			$playerTime = (touch.clientX / progress?.clientWidth) * $playerDuration;
		}
	}

	function handleMouseUp(e) {
		if (trackMouse) {
			trackMouse = false;
			// handleHeight = handleHeight / 2;
			$player.currentTime = $playerTime;
			$playerSaveTime = 0;
			$player.ontimeupdate = storedTimeUpdate;
		}
	}

	function handleTouchend(e) {
		if (trackMouse) {
			trackMouse = false;
			// handleHeight = handleHeight / 2;
			$player.currentTime = $playerTime;
			$playerSaveTime = 0;
			$player.ontimeupdate = storedTimeUpdate;
		}
	}

	function handleMouseMove(e) {
		let left = progress?.getBoundingClientRect().left;
		let right = progress?.getBoundingClientRect().right;
		if (trackMouse) {
			e.preventDefault(); //prevents highlighting on mouse move
			if (e.x < left) {
				$playerTime = 0;
				trackPosition = left;
			} else if (e.x > right) {
				$playerTime = $playerDuration;
				trackPosition = right;
			} else {
				$playerTime =
					((e.x - trackPosition) / progress?.clientWidth) * $playerDuration + $playerTime;
				trackPosition = e.x;
			}
			//updates chapterIndex to update chapter image
			// if ($playingEpisodeChapters) {
			// 	for (const [i, chapter] of $playingEpisodeChapters.entries()) {
			// 		if ($playerTime < chapter.startTime) {
			// 			$chapterIndex = i;
			// 			break;
			// 		}
			// 	}
			// }
		}
	}
	function handleTouchMove(e) {
		let touch = e.touches[0];
		let left = progress?.getBoundingClientRect()?.left;
		let right = progress?.getBoundingClientRect().right;
		if (trackMouse) {
			e.preventDefault(); //prevents highlighting on mouse move
			if (touch.clientX < left) {
				$playerTime = 0;
				trackPosition = left;
			} else if (touch.clientX > right) {
				$playerTime = $playerDuration;
				trackPosition = right;
			} else {
				$playerTime =
					((touch.clientX - trackPosition) / progress?.clientWidth) * $playerDuration + $playerTime;
				trackPosition = touch.clientX;
			}
			//updates chapterIndex to update chapter image
			// if ($playingEpisodeChapters) {
			// 	for (const [i, chapter] of $playingEpisodeChapters.entries()) {
			// 		if ($playerTime < chapter.startTime) {
			// 			$chapterIndex = i;
			// 			break;
			// 		}
			// 	}
			// }
		}
	}
</script>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<div
	class="progress-bar"
	on:mousedown={handleProgress}
	on:touchstart={handleTouchstart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchend}
	class:hide={$playingEpisode.liveStatus === 'live'}
>
	<div
		bind:this={progress}
		class="tracker"
		style="--tracker-color: {trackerColor}; --tracker-height: {`${trackerHeight}px`}"
	>
		<div
			class="elapsed"
			style="--elapsed-color: {elapsedColor}; --tracker-height: {`${trackerHeight}px`};
      --position: {`${percentage}%`}"
		/>
		<div
			bind:this={handle}
			class="handle"
			style="--handle-color: {handleColor}; --handle-height: {`${handleHeight}px`};
      --handle-position: {`${percentage}%`}; --handle-offset: {`${
				trackerHeight + (handleHeight - trackerHeight) / 2
			}px`}"
		/>
	</div>
</div>

<style>
	.progress-bar {
		width: 100%;
		height: 3em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background-color: transparent;
		z-index: 4;
	}

	.tracker {
		width: 100%;
		height: var(--tracker-height);
		border-radius: var(--tracker-height);
		background-color: var(--tracker-color);
	}

	.elapsed {
		height: 100%;
		width: var(--position);
		border-radius: var(--height);
		background-color: var(--elapsed-color);
	}
	.handle {
		height: var(--handle-height);
		width: var(--handle-height);
		border-radius: var(--handle-height);
		background-color: var(--handle-color);
		position: relative;
		left: calc(var(--handle-position) - var(--handle-height) / 2);
		bottom: var(--handle-offset);
		/* transition: all 0.1s ease;
    transition-property: height width; */
	}

	.hide {
		visibility: hidden;
	}
</style>
