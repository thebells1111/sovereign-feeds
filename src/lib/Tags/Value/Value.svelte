<script>
	import SharedValueComponent from './SharedValueComponent.svelte';

	import { rssData, editingEpisode, selectedPodcast } from '$/editor';

	export let type = 'episode';
	$: console.log(editingEpisode);
	$: console.log(selectedPodcast);
	let paymentType = 'keysend';
</script>

{#if $rssData}
	<div>
		<label>
			<input type="radio" name="paymentType" value="keysend" bind:group={paymentType} />
			Keysend
		</label>
		<label>
			<input type="radio" name="paymentType" value="lnaddress" bind:group={paymentType} />
			LN Address
		</label>
	</div>
	{#if type === 'episode'}
		<SharedValueComponent bind:data={$editingEpisode['podcast:value']} isEpisode={true} />
	{:else if type === 'podcast'}
		<SharedValueComponent bind:data={$rssData['podcast:value']} />
	{/if}
{/if}

<style>
</style>
