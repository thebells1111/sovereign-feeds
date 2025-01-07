<script>
	import clone from 'just-clone';
	import Keysend from './Keysend.svelte';
	import LNAdress from './LNAddress.svelte';

	export let selectedPerson = {};
	let originalPerson = clone(selectedPerson);
	export let updatePerson = () => {};
	let showProviderInput = false;
</script>

{#if selectedPerson}
	<div class="value-input-container">
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

		<section>
			{#if selectedPerson['@_type'] === 'node'}
				<Keysend bind:selectedPerson bind:showProviderInput />
			{:else if selectedPerson['@_type'] === 'lnaddress'}
				<LNAdress bind:selectedPerson />
			{/if}
		</section>
		<button
			class="primary"
			class:hide={showProviderInput}
			on:click={updatePerson.bind(this, originalPerson, selectedPerson)}>Update Person</button
		>
	</div>
{/if}

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
		height: 400px;
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

	section {
		flex: 1;
		width: 100%;
	}

	button {
		margin-bottom: 8px;
	}

	.hide {
		display: none;
	}
</style>
