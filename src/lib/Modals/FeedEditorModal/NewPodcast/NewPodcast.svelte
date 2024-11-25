<script>
	import Author from '$lib/Editor/Channel/Components/Author/Author.svelte';
	import Title from '$lib/Editor/Channel/Components/Title/Title.svelte';
	import Description from '$lib/Editor/Channel/Components/Description/Description.svelte';
	import Categories from '$lib/Editor/Channel/Components/Categories/Categories.svelte';
	import Language from '$lib/Editor/Channel/Components/Language/Language.svelte';
	import Image from '$lib/Editor/Channel/Components/Image/Image.svelte';
	import Link from '$lib/Editor/Channel/Components/Link/Link.svelte';

	import {
		rssData,
		newEditorScreen,
		duplicateEditorScreen,
		newEpisodeHeaders,
		tagHeaders
	} from '$/editor';
</script>

<div class="container">
	<div class="data-container">
		{#if $rssData}
			{#if $rssData['podcast:medium'] === 'music'}
				<Author />
			{/if}
			<Title />
			<Description />
			<Image />
			<Link />
			<Categories data={[].concat($rssData['itunes:category'])[0]} />
			<Language />
		{/if}
	</div>

	<button
		class="primary"
		on:click={() => {
			$newEditorScreen = 'duplicateEpisode';
			$duplicateEditorScreen = 'episodeMeta';
		}}>{$newEpisodeHeaders.firstEp}</button
	>
</div>

<style>
	.container {
		padding: 8px;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	button {
		margin-top: 8px;
		width: 250px;
		align-self: flex-end;
	}

	button.primary {
		margin-top: 8px;
		align-self: flex-end;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
	}
</style>
