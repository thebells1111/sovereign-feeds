<script>
	export let source;
</script>

<source-data>
	<source-group>
		<label>
			Source URI
			<input type="text" bind:value={source['@_uri']} required placeholder="required" />
		</label>
		<label>
			Content Type
			<input type="text" bind:value={source['@_contentType']} placeholder="optional" />
		</label>
	</source-group>
</source-data>

<style>
	source-title,
	source-header {
		display: flex;
		align-items: center;
	}

	source-data {
		display: block;
	}

	source-title,
	source-group {
		margin-left: 12px;
	}

	source-group > label:first-of-type {
		width: calc(75% - 8px);
	}

	label {
		display: flex;
		flex-direction: column;
	}

	h1,
	h2,
	h3,
	h4 {
		margin: 0;
	}

	source-data {
		margin-top: 8px;
		margin-bottom: 8px;
	}
	source-header {
		margin-bottom: 8px;
	}

	label {
		margin-right: 8px;
		width: calc(25% - 8px);
	}

	source-group {
		display: flex;
	}
</style>
