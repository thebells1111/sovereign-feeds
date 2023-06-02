<script>
	export let data;
	import { selectTextOnFocus } from '$functions/inputActions';
	import ToolTip from '$lib/Shared/ToolTip.svelte';
	import Select from 'svelte-select';

	const protocols = ['irc', 'xmpp', 'nostr', 'matrix'];
	let selectedProtocol = 'irc';
	let isProtocolSet = false;

	function handleSelect(e) {
		let slug = e.detail;
		data['podcast:chat']['@_protocol'] = slug.value;
	}

	$: if (!isProtocolSet && data?.['podcast:chat']?.['@_protocol']) {
		selectedProtocol = data['podcast:chat']['@_protocol'];
		isProtocolSet = true;
	}
</script>

{#if data?.['podcast:chat']}
	<div class="episode-chat">
		<h3>Chat</h3>
		<label>
			<title>
				<h4>Server</h4>
				<ToolTip>
					<p.tooltip>
						(required) The web address of a chat server that your listeners can connect to.
					</p.tooltip>
				</ToolTip>
			</title>
			<input type="text" bind:value={data['podcast:chat']['@_server']} use:selectTextOnFocus />
		</label>
		<label>
			<title>
				<h4>Protocol</h4>
				{data['podcast:chat']['@_protocol']}
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
		<label>
			<title>
				<h4>Account ID</h4>
				<ToolTip>
					<p.tooltip>
						(recommended) The account id of the podcaster on the server or platform being connected
						to.
					</p.tooltip>
				</ToolTip>
			</title>
			<input type="text" bind:value={data['podcast:chat']['@_accountId']} use:selectTextOnFocus />
		</label>
		<label>
			<title>
				<h4>Space Name</h4>
				<ToolTip>
					<p.tooltip>
						(optional) Some chat systems have a notion of a chat "space" or "room" or "topic". <br
						/>This attribute will serve that purpose.
					</p.tooltip>
				</ToolTip>
			</title>
			<input type="text" bind:value={data['podcast:chat']['@_space']} use:selectTextOnFocus />
		</label>
	</div>
{/if}

<style>
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
