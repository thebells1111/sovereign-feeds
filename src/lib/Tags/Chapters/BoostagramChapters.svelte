<script>
	import { goto } from '$app/navigation';

	import { editingEpisode, rssData, tagHeaders, selectedPodcast } from '$/editor';

	let reflexSplit = 5;
	function addReflex() {
		if (!$editingEpisode['podcast:value']['podcast:valueRecipient'].length) {
			$editingEpisode['podcast:value']['podcast:valueRecipient'] =
				$selectedPodcast.rss['podcast:value']['podcast:valueRecipient'] || [];
		}
		const valueRecipient = $editingEpisode['podcast:value']['podcast:valueRecipient'];

		console.log(Array.isArray(valueRecipient));
		console.log(
			valueRecipient.findIndex((v) => v?.['@_customValue'] === 'x3VXZtbcfIBVLIUqzWKV') === -1
		);
		if (
			Array.isArray(valueRecipient) &&
			valueRecipient.findIndex((v) => v?.['@_customValue'] === 'x3VXZtbcfIBVLIUqzWKV') === -1
		) {
			$editingEpisode['podcast:value']['podcast:valueRecipient'].push({
				'@_name': 'Reflex Boostagram Chapters',
				'@_type': 'node',
				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
				'@_customKey': '696969',
				'@_customValue': 'x3VXZtbcfIBVLIUqzWKV',
				'@_split': `${reflexSplit}`,
				'@_fee': 'true'
			});
		}
		$editingEpisode = $editingEpisode;
	}
</script>

<label>
	<input type="checkbox" bind:checked={$editingEpisode['podcast:chapters'].boostagrams} />
	<p>Surface Boostagrams in Chapters</p>
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
		<div>
			<p>
				This works by adding Reflex to your value block. Clicking below will automatically add them
				at a 5% split.
			</p>
			<button class="primary reflex" on:click={addReflex}>Add Reflex to your value block</button>
			<p>
				If you want to edit their split percentage, you can do so in the Value tab. <br />Just keep
				it at least 1% so they get your boosts
			</p>
		</div>
	{/if}
{/if}

<style>
	label {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	label p {
		margin: 0;
		padding: 0 0 0 8px;
		cursor: pointer;
	}

	label input {
		flex: 0;
		margin: 0;
		cursor: pointer;
	}

	input {
		width: 100%;
		padding: 8px;
	}

	div {
		display: flex;
		flex-direction: column;
	}

	button {
		align-self: flex-end;
	}

	button.reflex {
		align-self: center;
		width: 260px;
		margin: 0 auto 16px auto;
	}
	p {
		text-align: center;
	}
	h2 {
		text-align: center;
	}
</style>
