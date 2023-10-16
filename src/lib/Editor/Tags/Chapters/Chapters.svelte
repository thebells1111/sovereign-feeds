<script>
	import { goto } from '$app/navigation';

	import { editingEpisode, rssData, tagHeaders, selectedPodcast } from '$/editor';
	console.log($editingEpisode['podcast:value']['podcast:valueRecipient']);
	console.log($selectedPodcast.rss['podcast:value']['podcast:valueRecipient']);
</script>

{#if $rssData}
	<header>
		<div>
			<h4>{$tagHeaders.chapters.url}</h4>
		</div>

		<input type="text" bind:value={$editingEpisode['podcast:chapters']['@_url']} />
		{#if !($selectedPodcast?.url === 'https://sovereignfeeds.com/blankfeed.xml' || !$editingEpisode?.enclosure?.['@_url'])}
			<button
				class="primary"
				on:click={() => {
					goto(
						`/chapters/${encodeURIComponent($selectedPodcast?.url)}/${encodeURIComponent(
							$editingEpisode?.enclosure?.['@_url']
						)}`
					);
				}}
			>
				View Chapters
			</button>
		{/if}
		<label>
			<input type="checkbox" bind:checked={$editingEpisode['podcast:chapters'].boostagrams} />
			Surface Boostagrams in Chapters
		</label>

		{#if $editingEpisode['podcast:chapters']['@_url'].includes('reflex.livewire.io') && $editingEpisode?.['podcast:chapters']?.boostagrams}
			<h2>Hold your horse, partner!!!</h2>
			<h3>No need to include reflex.livewire.io in your link. We'll handle that for you.</h3>
			<h3>Just include the link to your non-boostagram chapters, if you have one.</h3>
		{/if}

		{#if $editingEpisode?.['podcast:chapters']?.boostagrams}
			<h2>
				Boostagram Chapters brought to you by <a href="https://reflex.livewire.io/">Reflex</a>
			</h2>
		{/if}
	</header>
{/if}

<style>
	header {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding-right: 8px;
		margin-bottom: 8px;
	}

	header > div {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	input {
		width: 100%;
		padding: 8px;
	}

	button {
		align-self: flex-end;
	}
</style>
