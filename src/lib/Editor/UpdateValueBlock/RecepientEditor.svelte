<script>
	import Keysend from './Keysend.svelte';
	import LNAdress from './LNAddress.svelte';

	export let selectedPerson = {};
</script>

<div class="value-input-container">
	{#if selectedPerson}
		<div class="type-select">
			<h4>Wallet Type:</h4>
			<label>
				<input type="radio" value="node" bind:group={selectedPerson['@_type']} />
				node
			</label>
			<label>
				<input type="radio" value="lnaddress" bind:group={selectedPerson['@_type']} />
				lnaddress
			</label>
		</div>

		{#if selectedPerson['@_type'] === 'node'}
			<Keysend bind:selectedPerson />
		{:else if selectedPerson['@_type'] === 'lnaddress'}
			<LNAdress bind:selectedPerson />
		{/if}
	{/if}
</div>

<style>
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: auto;
		margin: 8px;
		background-color: white;
	}
</style>
