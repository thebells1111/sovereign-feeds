<script>
	import EpisodeList from './EpisodeList/EpisodeList.svelte';
	import PlayList from './PlayList/PlayList.svelte';
	import NowPlaying from '$lib/Shared/NowPlaying/NowPlaying.svelte';
	import ControlButtons from '$lib/Shared/NowPlaying/ControlButtons/ControlButtons.svelte';

	import { middlePane, episodesListPane, rightPane, showMobile, swiper } from '$/stores';

	function handleNowPlaying() {
		if ($swiper) {
			$swiper.slideTo(0);
			$middlePane = 'episodesList';
			$rightPane = 'showNotes';
		} else {
			$middlePane = 'nowPlaying';
			$rightPane = 'showNotes';
		}
	}
</script>

<div class="middle-pane">
	{#if !$showMobile}
		<section class="tab-zone">
			<button
				class="left-button"
				class:active={$middlePane === 'nowPlaying'}
				on:click={handleNowPlaying}>Now Playing</button
			>

			<button
				class:active={$middlePane === 'playlist'}
				on:click={() => {
					$middlePane = 'playlist';
					$rightPane = 'showNotes';
				}}>Playlist</button
			>
			<button
				class:active={$middlePane === 'episodesList'}
				on:click={() => ($middlePane = 'episodesList')}>Episodes List</button
			>
		</section>
	{/if}

	<div bind:this={$episodesListPane} class="notes">
		<div class:hide={$middlePane != 'episodesList'}>
			<EpisodeList />
		</div>
		<div class:hide={$middlePane != 'playlist'}>
			<PlayList />
		</div>
		{#if !$showMobile}
			<div class:hide={$middlePane != 'nowPlaying'}>
				<ControlButtons />
				<NowPlaying />
			</div>
		{/if}
	</div>
</div>

<style>
	.middle-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
		background-color: var(--primary-color);
	}
	.notes {
		height: 100%;
		overflow: hidden;
		position: relative;
		flex: 1;
	}
	.notes > div {
		overflow: auto;
		position: relative;
		height: 100%;
	}
	.hide {
		display: none;
	}

	.tab-zone {
		display: flex;
	}

	.tab-zone button {
		width: 100%;
		height: 50px;
		background-color: transparent;
		border: 1px solid var(--border-color);
	}

	button.active {
		font-weight: 600;
		border-bottom-color: transparent;
	}

	button.left-button {
		border-left-color: transparent;
	}
</style>
