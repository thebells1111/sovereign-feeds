<script>
	import { rssData, tagHeaders } from '$/editor';
	$: console.log($rssData?.['podcast:podroll']);
</script>

{#if $rssData}
	{#each $rssData?.['podcast:podroll']?.['podcast:remoteItem'] as item}
		<div>
			<label>
				Feed Guid:
				<input bind:value={item['@_feedGuid']} />
			</label>
			<label>
				Item Guid:
				<input bind:value={item['@_itemGuid']} />
			</label>
		</div>
	{/each}
{/if}

<style>
	div {
		display: flex;
	}

	label {
		display: flex;
		flex-direction: column;
	}
</style>
