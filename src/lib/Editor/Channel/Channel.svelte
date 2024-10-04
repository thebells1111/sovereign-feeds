<script>
	import Header from './Header.svelte';
	import RequiredInfo from './RequiredInfo.svelte';
	import Person from '$lib/Tags/Person/Person.svelte';
	import Value from '$lib/Tags/Value/Value.svelte';
	import ShowArt from './ShowArt.svelte';
	import ShowInfo from './ShowInfo.svelte';
	import OwnerInfo from './OwnerInfo.svelte';
	import Funding from '$lib/Tags/Funding/Funding.svelte';
	import Block from './Block.svelte';
	import Trackers from './Trackers.svelte';
	import Podroll from '$lib/Tags/Podroll/Podroll.svelte';

	import { currentPage, rssData } from '$/editor';

	let podcastInfoPage = 'required';

	$: if ($currentPage === 'podcastMetadata') {
		podcastInfoPage = 'required';
	}
</script>

<Header bind:podcastInfoPage />

<div class:hide={podcastInfoPage !== 'required'}>
	<RequiredInfo />
</div>
<div class:hide={podcastInfoPage !== 'showArt'}>
	<ShowArt />
</div>
<div class:hide={podcastInfoPage !== 'showInfo'}>
	<ShowInfo />
</div>
<div class:hide={podcastInfoPage !== 'ownerInfo'}>
	<OwnerInfo />
</div>

<div class:hide={podcastInfoPage !== 'support'}>
	<Funding bind:data={$rssData} />
</div>

<div class:hide={podcastInfoPage !== 'person'}>
	<Person type="podcast" />
</div>

<div class:hide={podcastInfoPage !== 'value'}>
	<Value type="podcast" />
</div>

<div class:hide={podcastInfoPage !== 'block'}>
	<Block />
</div>

<div class:hide={podcastInfoPage !== 'trackers'}>
	<!-- <Trackers /> -->
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
