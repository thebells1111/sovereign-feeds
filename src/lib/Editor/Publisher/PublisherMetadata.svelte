<script>
	import Header from './Header.svelte';

	import Value from '$lib/Editor/Tags/Value/Value.svelte';
	import FeedArt from './FeedArt.svelte';
	import FeedInfo from './FeedInfo.svelte';
	import OwnerInfo from './OwnerInfo.svelte';
	import Support from './Support.svelte';
	import Person from '$lib/Editor/Tags/Person/Person.svelte';
	import Block from './Block.svelte';

	import Podroll from '$lib/Editor/Channel/Podroll/Podroll.svelte';

	import { currentPage } from '$/editor';

	let podcastInfoPage = 'showInfo';

	$: if ($currentPage === 'podcastMetadata') {
		podcastInfoPage = 'showInfo';
	}
</script>

<Header bind:podcastInfoPage />

<div class:hide={podcastInfoPage !== 'showInfo'}>
	<FeedInfo />
</div>
<div class:hide={podcastInfoPage !== 'showArt'}>
	<FeedArt />
</div>

<div class:hide={podcastInfoPage !== 'ownerInfo'}>
	<OwnerInfo />
</div>

<div class:hide={podcastInfoPage !== 'support'}>
	<Support />
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
	<Podroll {podcastInfoPage} />
</div>

<style>
	div {
		height: calc(100% - 39px);
	}
	.hide {
		display: none;
	}
</style>
