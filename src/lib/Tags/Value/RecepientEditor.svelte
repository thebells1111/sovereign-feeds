<script>
	import Cancel from '$lib/icons/Cancel.svelte';

	import Keysend from './Keysend.svelte';
	import LNAdress from './LNAddress.svelte';

	export let showValues = false;
	export let data = {};
	export let index = 1;
	let showProviderInput;

	function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
	}
</script>

<div class="value-input-container" class:show={showValues}>
	{#if data && data?.['podcast:valueRecipient']?.length > 0}
		<div class="type-select">
			<h4>Wallet Type:</h4>
			<label>
				<input
					type="radio"
					value="node"
					bind:group={data['podcast:valueRecipient'][index - 1]['@_type']}
				/>
				node
			</label>
			<label>
				<input
					type="radio"
					value="lnaddress"
					bind:group={data['podcast:valueRecipient'][index - 1]['@_type']}
				/>
				lnaddress
			</label>
		</div>

		<button
			class="cancel"
			on:click={() => {
				showValues = false;
				cancelProviderSubmit();
			}}
		>
			<Cancel size="30px" />
		</button>

		{#if data['podcast:valueRecipient'][index - 1]['@_type'] === 'node'}
			<Keysend bind:data bind:index bind:showProviderInput />
		{:else if data['podcast:valueRecipient'][index - 1]['@_type'] === 'lnaddress'}
			<LNAdress bind:data bind:index />
		{/if}
	{/if}
</div>

<style>
	.cancel {
		color: red;
		position: absolute;
		right: 0;
		top: 0;
		padding: 4px 4px 0 4px;
		margin: 0;
		background-color: transparent;
		border: none;
	}
	.type-select {
		display: flex;
		width: 100%;
	}

	h4 {
		margin: 0 8px 0 0;
		padding: 0;
		color: hsla(352, 100%, 43.7%, 1);
	}

	label {
		margin: 0 16px 0 0;
		cursor: pointer;
	}

	.value-input-container {
		height: 450px;
		width: 60%;
		min-width: 700px;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: auto;
		padding: 8px;
		border-radius: 4px;
		box-shadow: 0px 3px 10px 0px rgb(50 50 50 / 50%);
		margin: 8px;
		position: absolute;
		background-color: white;
		opacity: 0;
		top: 8px;
		right: -60%;
		transition:
			opacity 0.5s,
			right 0.5s;
		display: none;
	}

	.show {
		display: flex;
		opacity: 1;
		right: 0;
		transition:
			opacity 0s,
			right 0.5s;
	}
</style>
