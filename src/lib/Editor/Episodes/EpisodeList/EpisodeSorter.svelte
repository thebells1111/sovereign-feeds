<script>
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	export let episodes = [];

	function handleSort(e) {
		console.log(e);
		const { oldIndex, newIndex } = e;
		// Move the item in the array
		if (oldIndex !== newIndex) {
			const movedItem = episodes.splice(oldIndex, 1)[0];
			episodes.splice(newIndex, 0, movedItem);
		}
		console.log('Sorted items:', episodes);
	}

	let foo;

	onMount(async function () {
		Sortable.create(foo, {
			group: {
				name: 'foo',
				put: true,
				pull: false
			},
			animation: 200,
			onSort: handleSort
		});
	});
</script>

<section bind:this={foo}>
	{#each episodes as episode, i}
		<div class="list-group-item">
			{episode.title}
		</div>
	{/each}
</section>

<style>
	section {
		overflow: auto;
		height: calc(100vh - 80px);
		min-height: 640px;
		width: 100%;
		min-width: 480px;
	}
	.list-group-item {
		padding: 8px;
		margin: 4px;
		border: 1px solid white;
		transition: background-color 0.2s;
		border: 1px solid black;
	}
</style>
