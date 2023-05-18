<script>
	import { editingEpisode, episodesList, editingIndex, tagHeaders } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
	let linkInput;
	$: if ($editingEpisode?.guid?.['@_isPermaLink'] === 'true' && linkInput) {
		linkInput.disabled = true;
	} else if (linkInput) {
		linkInput.disabled = false;
	}

	import clone from 'just-clone';

	let episodes = [];
	let warningFlag = -1;

	$: if ($episodesList && $editingIndex === 0 ? true : $editingIndex) {
		episodes = clone(
			$episodesList.map((v) => {
				return v.link;
			})
		);
		episodes.splice($editingIndex, 1);
	}

	$: warningFlag = $editingEpisode?.link
		? episodes.findIndex((v) => v === $editingEpisode.link)
		: -1;
</script>

<div class="episode-link">
	<label>
		<div class="heading">
			<h3>{$tagHeaders.episodes.link}</h3>
			<p>{warningFlag > -1 ? '(duplicate Link)' : ''}</p>
		</div>
		<input
			type="text"
			bind:this={linkInput}
			bind:value={$editingEpisode.link}
			class:warning={warningFlag > -1}
			use:selectTextOnFocus
		/>
	</label>
</div>

<style>
	.episode-link {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0 12px 0 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.heading {
		display: flex;
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
</style>
