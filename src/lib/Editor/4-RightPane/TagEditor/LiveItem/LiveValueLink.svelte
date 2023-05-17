<script>
	import { editingEpisode, remoteServerUrl } from '$/editor';
	import { loggedIn } from '$/stores';
	import { selectTextOnFocus } from '$functions/inputActions';

	async function generateLink() {
		let res = await fetch('/api/database/generateguid');
		let data = await res.json();
		console.log(data.guid);
		if (data.guid) {
			$editingEpisode['@_liveValueLink'] = remoteServerUrl + '/event/' + data.guid;
		}
	}
</script>

<div class="content-link">
	<div class="header">
		<h3>Live Value Link:</h3>
		{#if $loggedIn}
			<button on:click={generateLink}>Generate Link</button>
		{:else}
			<p>Log In to Create</p>
		{/if}
	</div>
	<div class="input-container">
		<h4>URL:</h4>
		<label>
			<input type="text" bind:value={$editingEpisode['@_liveValueLink']} use:selectTextOnFocus />
		</label>
	</div>
</div>

<style>
	.content-link {
		margin-bottom: 8px;
	}
	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
		margin-left: 4px;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 8px;
	}
	.input-container {
		margin: 0 0 0 8px;
	}

	.header {
		display: flex;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.header button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 2px 8px;
		margin: 0 38px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
	}
</style>
