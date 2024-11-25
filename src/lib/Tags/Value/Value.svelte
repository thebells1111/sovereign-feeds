<script>
	import { onMount } from 'svelte';
	import SharedValueComponent from './SharedValueComponent.svelte';

	import { rssData, editingEpisode, selectedPodcast } from '$/editor';

	export let type = 'episode';

	let paymentType = 'lnaddress';

	onMount(() => {
		if (type === 'episode') {
			paymentType = $editingEpisode.paymentType || 'keysend';
		} else {
			paymentType = $selectedPodcast.paymentType || 'keysend';
		}
	});

	function handleChange(event) {
		paymentType = event.target.value; // Update paymentType manually
		if (type === 'episode') {
			$editingEpisode.paymentType = paymentType;
		} else {
			$selectedPodcast.paymentType = paymentType;
		}
	}
</script>

{#if $rssData}
	<div>
		<label>
			<input type="radio" name="paymentType" value="keysend" checked on:change={handleChange} />
			Keysend
		</label>
		<label>
			<input type="radio" name="paymentType" value="lnaddress" on:change={handleChange} />
			LN Address
		</label>
	</div>

	{#if type === 'episode'}
		<SharedValueComponent bind:data={$editingEpisode['podcast:value']} {paymentType} />
	{:else if type === 'podcast'}
		<SharedValueComponent bind:data={$rssData['podcast:value']} {paymentType} />
	{/if}
{/if}

<style>
</style>
