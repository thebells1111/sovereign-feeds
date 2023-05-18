<script>
	import Header from './Header.svelte';
	import RequiredInfo from './RequiredInfo.svelte';
	import Person from '$lib/Editor/Tags/Person/Person.svelte';
	import Value from '$lib/Editor/Tags/Value/Value.svelte';
	import ShowArt from './ShowArt.svelte';
	import ShowInfo from './ShowInfo.svelte';
	import OwnerInfo from './OwnerInfo.svelte';
	import Support from './Support.svelte';
	import Block from './Block.svelte';
	import Trackers from './Trackers.svelte';

	let podcastInfoPage = 'required';
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
	<Support />
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
	<Trackers />
</div>

<style>
	div {
		height: calc(100% - 39px);
	}
	.hide {
		display: none;
	}
</style>
