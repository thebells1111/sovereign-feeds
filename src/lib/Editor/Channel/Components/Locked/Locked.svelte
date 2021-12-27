<script>
	import { rssData, tagHeaders } from '$/editor';

	function handleLockedChange(e) {
		$rssData['podcast:locked']['#text'] = e.target.checked ? 'yes' : 'no';
	}
</script>

<h3>Lock Feed</h3>
<label class="check-box-label">
	<input
		type="checkbox"
		on:change={handleLockedChange}
		checked={$rssData['podcast:locked']['#text'] === 'yes'}
	/>
	Check this box if you want to claim ownership and lock this feed from being imported without email
	permission
</label>
<label class="locked">
	(a valid email is required for a host to send a request to when importing your feed)
	<input type="text" bind:value={$rssData['podcast:locked']['@_owner']} />
</label>

<style>
	.locked {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.locked input {
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
