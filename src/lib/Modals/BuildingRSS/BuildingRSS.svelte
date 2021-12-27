<script>
	import { onMount } from 'svelte';
	import { showBuildingRSS } from '$/editor';
</script>

<div class="modal">
	<div class="container">
		<h1>Building RSS File <br /> This may take a few seconds</h1>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		width: calc(100% + 8px);
		height: calc(100% + 48px);
		left: -8px;
		top: -48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.container {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}
</style>
