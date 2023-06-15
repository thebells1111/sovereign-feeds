<script>
	import LiveStatus from './Status.svelte';
	import LiveStart from './Start.svelte';
	import Duration from './Duration.svelte';
	import Enclosure from '../EpisodeMetadata/components/Enclosure.svelte';
	import GUID from '../EpisodeMetadata/components/GUID.svelte';
	import ContentLink from './ContentLink.svelte';
	import Chat from '../Chat/Chat.svelte';
	import { rssData, editingEpisode, rightPane } from '$/editor';
	import LiveValueLink from './LiveValueLink.svelte';
</script>

<div>
	{#if $rssData && $editingEpisode['@_status']}
		<LiveStatus />
		<Enclosure />
		<GUID />
		<LiveStart />
		<Duration />
		<Chat bind:data={$editingEpisode} />
		<LiveValueLink />
		<ContentLink />

		<p>
			Add title and image in <button on:click={() => ($rightPane = 'episodeMetadata')}
				>Episode Info</button
			>
		</p>
	{/if}
</div>

<style>
	div {
		padding-right: 8px;
	}
	p {
		text-align: center;
		color: hsla(292, 100%, 33%, 1);
		font-size: 1.1em;
		font-weight: 600;
	}

	button {
		background-color: transparent;
		border: 1px solid rgb(27, 111, 246);
		border-radius: 4px;
		color: rgb(27, 111, 246);
		font-weight: 600;
	}
</style>
