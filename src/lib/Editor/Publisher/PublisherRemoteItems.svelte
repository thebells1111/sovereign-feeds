<script>
	import Publisher from '$lib/Tags/Publisher/Publisher.svelte';
	import { currentPage } from '$/editor';
</script>

<Publisher reload={$currentPage === 'publisherRemoteItems'} />
