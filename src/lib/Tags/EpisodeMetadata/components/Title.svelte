<script>
	import {
		editingEpisode,
		episodesList,
		editingIndex,
		tagHeaders,
		filteredEpisodesList,
		digitalOceanEnabled
	} from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
	import clone from 'just-clone';

	let episodes = [];
	let warningFlag = -1;

	$: if ($episodesList && $editingIndex === 0 ? true : $editingIndex) {
		episodes = clone(
			$episodesList.map((v) => {
				return v.title;
			})
		);
		episodes.splice($editingIndex, 1);
	}

	$: warningFlag = episodes.findIndex((v) => v === $editingEpisode.title);
</script>

<div class="episode-title">
	<label>
		<div class="heading">
			<h3>
				{$tagHeaders.episodes.title}
				{#if $digitalOceanEnabled}
					<span class="important-warning">(IMPORTANT: fill this out before uploading files)</span
					>{/if}
			</h3>
			<p>{warningFlag > -1 ? '(duplicate title)' : ''}</p>
		</div>
		<input
			type="text"
			bind:value={$editingEpisode.title}
			class:warning={warningFlag > -1}
			on:input={() => {
				$editingEpisode = $editingEpisode;
				$episodesList = $episodesList;
				$editingEpisode['itunes:subtitle'] = $editingEpisode.title;
			}}
			use:selectTextOnFocus
		/>
	</label>
</div>

<style>
	.episode-title {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	.heading {
		display: flex;
	}
	h3 {
		margin: 0 12px 0 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	p {
		margin: 0;
		padding: 0;
		color: red;
	}
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		margin-left: 4px;
	}

	.warning,
	.warning:focus {
		outline: 2px solid red;
	}

	.important-warning {
		margin-left: 16px;
	}
</style>
