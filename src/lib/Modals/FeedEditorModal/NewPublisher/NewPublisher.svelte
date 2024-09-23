<script>
	import Author from '$lib/Editor/Channel/Components/Author/Author.svelte';
	import Title from '$lib/Editor/Channel/Components/Title/Title.svelte';
	import Description from '$lib/Editor/Channel/Components/Description/Description.svelte';

	import Link from '$lib/Editor/Channel/Components/Link/Link.svelte';

	import { rssData, newEditorScreen } from '$/editor';

	$: console.log($rssData);
</script>

<div class="overflow-container">
	<div class="data-container">
		{#if $rssData}
			<Title />
			<Link />
			<Author />
			<Description />
		{/if}
	</div>
</div>

<div class="footer">
	<button
		class="primary"
		on:click={() => {
			$newEditorScreen = 'publisherImages';
		}}
		>Publisher Images
	</button>
</div>

<style>
	.overflow-container {
		height: calc(100% - 64px);
		overflow: auto;
		padding: 8px;
	}

	.footer {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		align-items: center;
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	button.primary {
		align-self: flex-end;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
		margin-bottom: 8px;
	}
</style>
