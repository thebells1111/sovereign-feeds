<script>
	import Publisher from '$lib/Tags/Publisher/Publisher.svelte';

	import { newEditorScreen } from '$/editor';
</script>

<div class="overflow-container">
	<Publisher />
</div>

<div class="footer">
	<button class="primary" on:click={() => ($newEditorScreen = 'publisherImages')}> Images </button>
	<button class="primary" on:click={() => ($newEditorScreen = 'publisherValue')}> Value </button>
</div>

<style>
	.overflow-container {
		height: calc(100% - 64px);
		overflow: auto;
		padding: 8px;
	}

	.footer {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		align-items: center;
	}

	.footer button {
		cursor: pointer;
		margin: 0 8px;
		padding: 0 8px;
	}

	button.primary {
		align-self: flex-end;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
		width: 235px;
		height: 50px;
		margin-bottom: 8px;
	}
</style>
