<script>
	import Image from '$lib/Editor/Channel/Components/Image/Image.svelte';
	import Banners from '$lib/Editor/Tags/Banners/Banners.svelte';

	import { rssData } from '$/editor';
</script>

<Image />
<Banners bind:data={$rssData['media:thumbnail']} />
