<script>
	import { rssData, newEditorScreen } from '$/editor';
	import setHeaderText from '$lib/Labels/setHeaderText';
</script>

<div class="container">
	<h3>Do you have a Digital Ocean Spaces account you would like to use?</h3>
	<div class="button-container">
		<button
			class="primary"
			on:click={() => {
				$newEditorScreen = 'digitalOceanSetup';
			}}>Yes</button
		>

		<button
			class="primary not-yet"
			on:click={() => {
				$newEditorScreen = 'typeSelect';
			}}>Not Yet</button
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

	.button-container {
		width: 550px;
		display: flex;
		justify-content: space-around;
	}

	.primary.not-yet {
		background-image: linear-gradient(to bottom, hsl(11, 100%, 37%), hsl(11, 100%, 27%));
	}
</style>
