<script>
	import { editingEpisode } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
</script>

<div class="episode-chat">
	<label>
		<h3>Chat Link</h3>
		<p>
			This is an experimental item to include a link to a chatroom for your podcast. <br />The
			website linked to should be able to be opened in an iframe
		</p>

		<input type="text" bind:value={$editingEpisode['@_chat']} use:selectTextOnFocus />
	</label>
</div>

<style>
	.episode-chat {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
		margin-left: 4px;
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin: 0 0 0 8px;
	}
	p {
		padding: 0%;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
