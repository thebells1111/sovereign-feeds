<script>
	import NowPlaying from '$lib/Shared/NowPlaying/NowPlaying.svelte';

	import { middlePane, player, showCC } from '$/stores';
</script>

<div class:hide={$middlePane != 'nowPlaying'}>
	<NowPlaying />
</div>

<style>
</style>
