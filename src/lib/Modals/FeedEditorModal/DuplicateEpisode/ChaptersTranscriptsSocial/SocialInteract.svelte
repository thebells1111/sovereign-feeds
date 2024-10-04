<script>
	import { socialInteractProtocolOptions } from '$/editor';
	import blankSocialInteract from '$lib/Editor/_functions/blanks/socialInteract';
	import TextBlock from '$lib/Tags/Shared/TextBlock.svelte';
	import NumberBlock from '$lib/Tags/Shared/NumberBlock.svelte';
	export let data;

	let index = 0;

	$: console.log(data);
</script>

<div class="container">
	<div class="blocks-container">
		{#if data}
			<TextBlock title="Interaction Link" {index} bind:data={data[index]['@_uri']} noStyle={true} />

			<div class="block">
				<label>
					<div class="heading">
						<h4>Platform</h4>
					</div>
					<select bind:value={data[index]['@_protocol']}>
						{#each $socialInteractProtocolOptions as option}
							<option value={option}>
								{option}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<TextBlock
				title="Platform Account ID"
				{index}
				bind:data={data[index]['@_accountId']}
				noStyle={true}
			/>

			<TextBlock
				title="Account URL for this platform"
				{index}
				bind:data={data[index]['@_accountUrl']}
				noStyle={true}
			/>

			<NumberBlock
				title="Priority (lower number means higher priority)"
				{index}
				bind:data={data[index]['@_priority']}
				min="1"
				noStyle={true}
			/>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 8px;
		width: 100%;
	}

	.blocks-container {
		overflow: auto;
	}

	h4 {
		margin: 0;
	}

	.block {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
		padding: 0 4px;
	}
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

	select {
		flex-grow: 1;
		padding: 8px;
	}
</style>
