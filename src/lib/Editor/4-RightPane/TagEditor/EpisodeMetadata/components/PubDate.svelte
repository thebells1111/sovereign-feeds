<script>
	import { editingEpisode, episodesList } from '$/editor';
</script>

<div class="episode-pubdate">
	<label>
		<div>
			<h3>Publication Date</h3>
			<button
				class="fancy"
				on:click={() => {
					let pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';
					$editingEpisode.pubDate = pubDate;
				}}>Set Pub Date To Current Time</button
			>
		</div>
		<input
			type="text"
			bind:value={$editingEpisode.pubDate}
			on:input={() => {
				$editingEpisode = $editingEpisode;
				$episodesList = $episodesList;
			}}
		/>
	</label>
</div>

<style>
	.episode-pubdate {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	label > div {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 4px;
	}

	button.fancy {
		padding: 2px 8px;
		margin: 0 16px;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	html[data-theme='dark'] button.fancy {
		border-bottom: 1px solid hsla(352, 100%, 26.7%, 1);
	}
</style>
