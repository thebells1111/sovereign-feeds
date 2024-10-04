<script>
	import Feeds from '$lib/Editor/Feeds/Feeds.svelte';
	import { showMobile } from '$/stores';
</script>

<div class="main-container">
	<div class="pane-container" class:mobile={$showMobile}>
		<Feeds fromChapters={true} />
	</div>
</div>
s

<style>
	.main-container {
		display: flex;
		place-content: center;
		height: 100%;
	}

	.pane-container {
		height: calc(100% - 16px);
		width: 100%;
		max-width: 500px;
		margin: 8px;
		padding: 8px 0;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	}

	.mobile {
		box-shadow: none;
		margin: 0;
	}
</style>
