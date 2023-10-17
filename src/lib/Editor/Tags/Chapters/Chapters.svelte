<script>
	import { goto } from '$app/navigation';

	import { editingEpisode, rssData, tagHeaders, selectedPodcast } from '$/editor';

	let reflexSplit = 5;
	function addReflex() {
		console.log($editingEpisode['podcast:value']['podcast:valueRecipient']);
		console.log($selectedPodcast.rss['podcast:value']['podcast:valueRecipient']);
		if (!$editingEpisode['podcast:value']['podcast:valueRecipient'].length) {
			$editingEpisode['podcast:value']['podcast:valueRecipient'] =
				$selectedPodcast.rss['podcast:value']['podcast:valueRecipient'] || [];
		}
		const valueRecipient = $editingEpisode['podcast:value']['podcast:valueRecipient'];

		if (
			Array.isArray(valueRecipient) &&
			valueRecipient.findIndex((v) => v?.['@_customValue'] === 'x3VXZtbcfIBVLIUqzWKV') === -1
		) {
			$editingEpisode['podcast:value']['podcast:valueRecipient'].push({
				'@_name': 'Reflex',
				'@_type': 'node',
				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
				'@_customKey': '696969',
				'@_customValue': 'x3VXZtbcfIBVLIUqzWKV',
				'@_split': `${reflexSplit}`,
				'@_fee': 'true'
			});
		}
	}
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

		{#if $editingEpisode?.['podcast:chapters']?.['@_url']?.includes('reflex.livewire.io') && $editingEpisode?.['podcast:chapters']?.boostagrams}
			<h2>Hold your horse, partner!!!</h2>
			<h3>No need to include reflex.livewire.io in your link. We'll handle that for you.</h3>
			<h3>Just include the link to your non-boostagram chapters, if you have one.</h3>
		{/if}

		{#if $editingEpisode?.['podcast:chapters']?.boostagrams}
			<h2>
				Boostagram Chapters brought to you by <a href="https://reflex.livewire.io/">Reflex</a>
			</h2>

			{#if Array.isArray($editingEpisode?.['podcast:value']?.['podcast:valueRecipient']) && $editingEpisode?.['podcast:value']?.['podcast:valueRecipient']?.findIndex((v) => v?.['@_customValue'] === 'x3VXZtbcfIBVLIUqzWKV') === -1}
				<input type="number" bind:value={reflexSplit} />

				<button on:click={addReflex}>Add Reflex to your value block to process Boostagrams</button>
			{/if}
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
