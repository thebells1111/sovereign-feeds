<script>
	import blankAlternateEnclosure from '$lib/Editor/_functions/blanks/alternateEnclosure.js';
	import clone from 'just-clone';
	import { rssData, editingEpisode } from '$/editor';
	import AlternateEnclosureBlock from './AlternateEnclosureBlock.svelte';
	import IndexScroll from '../Shared/IndexScroll.svelte';

	let blank = clone(blankAlternateEnclosure[0]);

	let index = 0;
</script>

{#if $rssData && $editingEpisode?.['podcast:alternateEnclosure'] && $editingEpisode?.['podcast:alternateEnclosure']?.[0]?.['podcast:source']?.length}
	<div class="container">
		<IndexScroll
			bind:data={$editingEpisode['podcast:alternateEnclosure']}
			bind:index
			title={'Alternate Enclosures'}
			{blank}
		/>
		<AlternateEnclosureBlock bind:enclosureIndex={index} />
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100%);
	}

	enclosure {
		display: block;
		height: calc(100% - 48px);
		overflow: auto;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 0 0 8px;
		padding: 0;
		border-radius: 100%;
		background-color: transparent;
		border: none;
		color: var(--primary-button-color-light);
	}

	button.add {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
