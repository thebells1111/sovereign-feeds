<script>
	import {
		player,
		playingEpisodeChapters,
		playerTime,
		chapterIndex,
		playerDuration,
		posterUrl,
		playerIsPaused
	} from '$/stores';

	export let enclosure;

	let playerTimeout;

	import { browser } from '$app/env';

	function setPlayerTime() {
		if ($player) {
			if (playerTimeout) {
				clearTimeout(playerTimeout);
			}
			playerTimeout = setTimeout(playerSetup, 200);
		} else {
			console.log('set');
			setTimeout(setPlayerTime, 100);
		}
	}

	if (browser) {
		setPlayerTime();
	}

	async function playerSetup() {
		$playerTime = 0.1;
		$player.currentTime = $playerTime;
		$playerDuration = $player.duration;

		$player.onplay = async () => {
			$playerIsPaused = false;
		};

		$player.onpause = async () => {
			$playerIsPaused = true;
		};

		$player.onloadedmetadata = async () => {
			console.log($player.duration);
			$playerDuration = $player.duration;
			console.log($playerDuration);
		};

		$player.ontimeupdate = handleTimeUpdate;
	}

	async function handleTimeUpdate() {
		$playerTime = $player?.currentTime;

		//updates the chapters images to current position
		while ($playerTime >= $playingEpisodeChapters?.[$chapterIndex + 1]?.startTime) {
			$chapterIndex++;
		}

		while ($playerTime < $playingEpisodeChapters?.[$chapterIndex]?.startTime) {
			$chapterIndex--;
		}
	}

	$: console.log(enclosure);
</script>

<video
	disableRemotePlayback
	playsinline
	preload="metadata"
	controls
	src={enclosure}
	bind:this={$player}
	poster={$posterUrl}
/>

<style>
	video {
		/* display: none */
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.hide {
		display: none;
	}
</style>
