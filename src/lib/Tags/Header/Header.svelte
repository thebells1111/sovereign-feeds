<script>
	import { rightPane, rssData, editingEpisode, selectorList, showLiveEpisodes } from '$/editor';
	import initTinyMCE from '$lib/Tags/ShowNotes/initTinyMCE';

	$rightPane = 'episodeMetadata';
</script>

<h3>{$editingEpisode?.title}</h3>
<ul>
	{#if $rssData && $editingEpisode?.['@_status']}
		<li
			class:active={$rightPane === 'liveItem'}
			on:click={() => {
				$rightPane = 'liveItem';
			}}
		>
			{$selectorList.live}
		</li>
	{/if}
	<li
		class:active={$rightPane === 'episodeMetadata'}
		on:click={() => ($rightPane = 'episodeMetadata')}
	>
		{$selectorList.episode}
	</li>

	<li
		class:active={$rightPane === 'showNotes'}
		on:click={() => {
			$rightPane = 'showNotes';
			if (!window.tinymce.activeEditor) {
				initTinyMCE();
			}
			window.tinymce.activeEditor.setContent($editingEpisode?.description || '');
		}}
	>
		{$selectorList.notes}
	</li>

	<li class:active={$rightPane === 'person'} on:click={() => ($rightPane = 'person')}>
		{$selectorList.person}
	</li>

	<li class:active={$rightPane === 'social'} on:click={() => ($rightPane = 'social')}>
		{$selectorList.social}
	</li>

	<li
		class:active={$rightPane === 'chapters'}
		on:click={() => {
			$rightPane = 'chapters';
		}}
	>
		{$selectorList.chapters}
	</li>

	<li
		class:active={$rightPane === 'transcript'}
		on:click={() => {
			$rightPane = 'transcript';
		}}
	>
		{$selectorList.transcripts}
	</li>

	<li
		class:active={$rightPane === 'value'}
		on:click={() => {
			$rightPane = 'value';
		}}
	>
		Value
	</li>
	<li
		class:active={$rightPane === 'funding'}
		on:click={() => {
			$rightPane = 'funding';
		}}
	>
		Funding
	</li>
	<li
		class:active={$rightPane === 'location'}
		on:click={() => {
			$rightPane = 'location';
		}}
	>
		Location
	</li>

	<!-- <li
		class:active={$rightPane === 'images'}
		on:click={() => {
			$rightPane = 'images';
		}}
	>
		{$selectorList.images}
	</li> -->

	{#if !$showLiveEpisodes}
		<li
			class:active={$rightPane === 'valueSplits'}
			on:click={() => {
				$rightPane = 'valueSplits';
			}}
		>
			Value Time Splits
		</li>
	{/if}
	<li
		class:active={$rightPane === 'altEnclosures'}
		on:click={() => {
			$rightPane = 'altEnclosures';
		}}
	>
		Alt Enclosures
	</li>
</ul>

<style>
	h3 {
		margin: 0;
		text-align: center;
		color: hsla(352, 100%, 33%, 1);
	}

	ul {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	li {
		list-style: none;
		padding: 4px 16px;
		margin: 4px 0;
		cursor: pointer;
		font-weight: 600;
	}

	.active {
		color: rgb(27, 111, 246);
		border-bottom: 2px solid rgb(27, 111, 246);
	}
</style>
