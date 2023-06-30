<script>
	import Select from 'svelte-select';
	import ToolTip from '$lib/Shared/ToolTip.svelte';
	import { editingEpisode, remoteServerUrl } from '$/editor';
	import { loggedIn } from '$/stores';
	import { selectTextOnFocus } from '$functions/inputActions';

	async function generateLink() {
		let res = await fetch(remoteServerUrl + '/api/sf/generateguid', { credentials: 'include' });
		let data = await res.json();
		if (data.guid) {
			valueUri = remoteServerUrl + '/event?event_id=' + data.guid;
			$editingEpisode['podcast:liveValue']['@_uri'] = valueUri;
		}
	}

	const protocols = ['socket.io', 'websocket', 'xmpp'];
	let selectedProtocol = 'socket.io';
	let valueUri = '';
	let isProtocolSet = false;

	function handleSelect(e) {
		let slug = e.detail;
		$editingEpisode['podcast:liveValue']['@_protocol'] = slug.value;
	}

	$: if (!isProtocolSet && $editingEpisode['podcast:liveValue']) {
		selectedProtocol = $editingEpisode['podcast:liveValue']['@_protocol'];
		valueUri = $editingEpisode['podcast:liveValue']['@_uri'];
		isProtocolSet = true;
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
		<title>
			<h4>URL:</h4>
			<ToolTip>
				<p.tooltip> (required) The link to the broadcasting server. </p.tooltip>
			</ToolTip>
		</title>
		<label>
			<input
				type="text"
				bind:value={valueUri}
				on:input={(e) => {
					$editingEpisode['podcast:liveValue']['@_uri'] = e.target.value;
				}}
				use:selectTextOnFocus
			/>
		</label>
		<label>
			<title>
				<h4>Protocol</h4>
				<ToolTip>
					<p.tooltip> (required) The protocol in use on the server. </p.tooltip>
				</ToolTip>
			</title>
			<Select
				items={protocols}
				value={selectedProtocol}
				on:select={handleSelect}
				isClearable={false}
				--margin="0 0 8px 8px"
			/>
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

	.episode-chat {
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
		margin-left: 4px;
	}

	p.tooltip {
		padding: 0%;
		color: white;
		margin-left: 0px;
	}

	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	title {
		display: flex;
		align-items: center;
	}

	h4 {
		color: hsla(352, 100%, 33%, 1);
		margin: 0 8px 4px 8px;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin: 0 0 8px 8px;
	}
	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
