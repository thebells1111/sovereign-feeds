<script>
	import Header from './Header.svelte';

	import Value from '$lib/Tags/Value/Value.svelte';
	import FeedArt from './FeedArt.svelte';
	import Publisher from '$lib/Tags/Publisher/Publisher.svelte';
	import FeedInfo from './FeedInfo.svelte';
	import OwnerInfo from './OwnerInfo.svelte';
	import Funding from '$lib/Tags/Funding/Funding.svelte';
	import Person from '$lib/Tags/Person/Person.svelte';
	import Block from './Block.svelte';
	import Podroll from '$lib/Tags/Podroll/Podroll.svelte';

	import { currentPage, rssData } from '$/editor';

	let podcastInfoPage = 'showInfo';

	$: if ($currentPage === 'podcastMetadata') {
		podcastInfoPage = 'showInfo';
	}

	$: console.log(podcastInfoPage);
</script>

<Header bind:podcastInfoPage />

<div class:hide={podcastInfoPage !== 'showInfo'}>
	<FeedInfo />
</div>
<div class:hide={podcastInfoPage !== 'showArt'}>
	<FeedArt />
</div>

<div class:hide={podcastInfoPage !== 'feedList'}>
	<Publisher {podcastInfoPage} />
</div>

<div class:hide={podcastInfoPage !== 'ownerInfo'}>
	<OwnerInfo />
</div>

<div class:hide={podcastInfoPage !== 'support'}>
	<Funding bind:data={$rssData} />
</div>

<div class:hide={podcastInfoPage !== 'value'}>
	<Value type="podcast" />
</div>

<div class:hide={podcastInfoPage !== 'person'}>
	<Person type="podcast" />
</div>

<div class:hide={podcastInfoPage !== 'block'}>
	<Block />
</div>

<div class:hide={podcastInfoPage !== 'podroll'}>
	<Podroll podcastInfoPage />
</div>

<style>
	div {
		height: calc(100% - 39px);
	}
	.hide {
		display: none;
	}
</style>
