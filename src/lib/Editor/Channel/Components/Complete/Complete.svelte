<script>
	import { rssData, tagHeaders } from '$/editor';

	function handleCompleteChange(e) {
		$rssData['podcast:complete']['#text'] = e.target.checked ? 'yes' : 'no';
	}
</script>

<h3>{$tagHeaders.channel.complete}</h3>
<label class="check-box-label">
	<input
		type="checkbox"
		on:change={handleCompleteChange}
		checked={$rssData['podcast:complete']['#text'] === 'yes'}
	/>
	Check this box if nothing else will ever be added to this feed.
</label>
<label class="archive">
	(optional link to a webpage that contains every episode of this feed)
	<input type="text" bind:value={$rssData['podcast:complete']['@_archive']} />
</label>

<style>
	.archive {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.archive input {
		flex-grow: 1;
		padding: 8px;
	}

	.check-box-label {
		margin: 4px 8px;
		font-size: 1.1em;
		font-weight: 600;
		cursor: pointer;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
