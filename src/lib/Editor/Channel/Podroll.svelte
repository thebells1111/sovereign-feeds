<script>
	import { rssData, tagHeaders } from '$/editor';
</script>

{#each rssData?.['podcast:podroll']?.['podcast:remoteItem'] as item}
	<label>
		Feed Guid:
		<input bing:value={item['feedGuid']} />
	</label>
	<label>
		Item Guid:
		<input bing:value={item['itemGuid']} />
	</label>
{/each}
