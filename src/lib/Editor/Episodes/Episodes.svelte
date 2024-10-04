<script>
	import EpisodeList from './EpisodeList/EpisodeList.svelte';
	export let fromChapters = false;
</script>

<div class="middle-pane">
	<div class="notes">
		<div>
			<EpisodeList {fromChapters} />
		</div>
	</div>
</div>

<style>
	.middle-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
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

	button.primary {
		position: absolute;
		height: 60px;
		width: 35px;
		top: calc(50% - 30px);
		border-radius: 0 30px 30px 0;
		background-image: linear-gradient(to bottom, hsl(209, 82%, 50%), hsl(209, 82%, 30%));
	}

	.hide {
		display: none;
	}
</style>
