<script>
	import { editingEpisode, editingIndex, episodesList, tagHeaders } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';

	// $: if ($editingEpisode?.guid?.['@_isPermaLink'] === 'true') {
	// 	$editingEpisode.link = $editingEpisode.guid['#text'];
	// }

	function updateLink() {
		if ($editingEpisode?.guid?.['@_isPermaLink'] === 'true') {
			$editingEpisode.link = $editingEpisode.guid['#text'];
		}
	}

	import clone from 'just-clone';

	let episodes = [];
	let warningFlag = -1;

	$: if ($episodesList && $editingIndex === 0 ? true : $editingIndex) {
		episodes = clone(
			$episodesList.map((v) => {
				return v?.guid?.['#text'];
			})
		);
		episodes.splice($editingIndex, 1);
	}

	$: warningFlag = episodes.findIndex((v) => v === $editingEpisode.guid?.['#text']);
</script>

<div class="episode-guid">
	<label>
		<div class="heading">
			<h3>{$tagHeaders.episodes.guid}</h3>
			<p>{warningFlag > -1 ? '(duplicate GUID)' : ''}</p>
		</div>
		<input
			type="text"
			bind:value={$editingEpisode.guid['#text']}
			on:input={updateLink}
			class:warning={warningFlag > -1}
			use:selectTextOnFocus
		/>
	</label>
	<div class="permalink">
		<h4>isPermaLink:</h4>
		<div class="permalink-label-container">
			<label class="permalink-radio">
				<input type="radio" bind:group={$editingEpisode.guid['@_isPermaLink']} value={false} />
				No
			</label>

			<label class="permalink-radio">
				<input type="radio" bind:group={$editingEpisode.guid['@_isPermaLink']} value={true} />
				Yes
			</label>
		</div>
	</div>
</div>

<style>
	.episode-guid {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
	}
	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.heading {
		display: flex;
	}
	h3 {
		margin: 0 12px 0 0;
	}

	p {
		margin: 0;
		padding: 0;
		color: red;
	}

	input[type='text'] {
		width: calc(100% - 4px);
		padding: 8px;
		margin-left: 4px;
	}
	.permalink {
		padding-left: 8px;
	}
	.permalink-label-container {
		display: flex;
		padding-left: 8px;
	}
	.permalink-label-container > label {
		padding-right: 8px;
		margin-right: 12px;
		cursor: pointer;
	}

	.warning,
	.warning:focus {
		outline: 2px solid red;
	}
</style>
