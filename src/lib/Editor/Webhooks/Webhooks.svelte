<script>
	import { selectedPodcast } from '$/editor';
	import { loggedIn } from '$/stores';
	import DigitalOceanHooks from './DigitalOceanHooks.svelte';

	import Explainer from './Explainer.svelte';
	import ServerHooks from './ServerHooks.svelte';

	let showSaved = false;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->

<div class="webhook-container">
	{#if $loggedIn}
		<DigitalOceanHooks bind:showSaved />
		{#if $selectedPodcast.title}
			<ServerHooks bind:showSaved />
			<Explainer />
		{:else}
			<p>Please Select a Feed</p>
		{/if}
	{:else}
		<h3>Sign In to Add Web Hooks</h3>
	{/if}
</div>

<div class="modal" class:show={showSaved}>
	<div class="container">
		<h1>Saved!</h1>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		width: calc(100% + 8px);
		height: calc(100% + 48px);
		left: -8px;
		top: -48px;
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.show {
		display: flex;
	}

	.container {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}

	.webhook-container {
		background-color: white;
		padding: 8px;
		margin-bottom: 8px;
	}

	h1 {
		margin: 0;
		color: hsl(226, 82%, 30%);
	}

	p {
		font-weight: 550;
	}
</style>
