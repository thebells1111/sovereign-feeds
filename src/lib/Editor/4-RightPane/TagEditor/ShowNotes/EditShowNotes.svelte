<script>
</script>

<section>
	<div class="show-notes">
		<textarea id="tiny-editor-description" />
	</div>
</section>

<style>
	section {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.show-notes {
		overflow: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(.shownotes-load-episode-button:hover > svg) {
		color: #111;
		transform: scale(1.2);
		transition-duration: 0.2s;
	}

	textarea {
		height: 100%;
		width: 100%;
	}
</style>
