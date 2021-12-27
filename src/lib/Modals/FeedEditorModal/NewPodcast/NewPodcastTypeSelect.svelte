<script>
	import { rssData, newEditorScreen } from '$/editor';
	import setHeaderText from '$lib/Editor/_functions/setHeaderText';
</script>

<div class="container">
	<h3>What type of feed are you looking to create?</h3>
	<div class="button-continer">
		<button
			class="primary"
			on:click={() => {
				$rssData['podcast:medium'] = 'podcast';
				$newEditorScreen = 'podcast';
				setHeaderText($rssData);
			}}>Podcast</button
		>

		<button
			class="primary"
			on:click={() => {
				$rssData['podcast:medium'] = 'music';
				$newEditorScreen = 'podcast';
				setHeaderText($rssData);
			}}>Music Album</button
		>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
