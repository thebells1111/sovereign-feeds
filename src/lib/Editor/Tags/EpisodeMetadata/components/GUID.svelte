<script>
	import { editingEpisode, editingIndex, episodesList, tagHeaders } from '$/editor';
	import { selectTextOnFocus } from '$functions/inputActions';
	import { v4 as uuidv4 } from 'uuid';

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

	function generateGuid() {
		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, episodes));
		$editingEpisode.guid['#text'] = blockGuid;
		$editingEpisode.guid['@_isPermaLink'] = false;
	}

	function generateBlockGuid() {
		let uniqueId = uuidv4();
		return uniqueId;
	}

	function isBlockGuidUnique(blockGuid, blocks) {
		for (let block of blocks) {
			if (block.guid?.['#text'] === blockGuid) {
				return false;
			}
		}
		return true;
	}
</script>

<div class="episode-guid">
	<div class="heading" on:click|stopPropagation>
		<h3>{$tagHeaders.episodes.guid}</h3>
		<button on:click={generateGuid}>Generate GUID</button>
		<p>{warningFlag > -1 ? '(duplicate GUID)' : ''}</p>
	</div>

	<input
		type="text"
		bind:value={$editingEpisode.guid['#text']}
		on:input={updateLink}
		class:warning={warningFlag > -1}
		use:selectTextOnFocus
	/>
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
		margin-bottom: 4px;
	}
	h3 {
		margin: 0 12px 0 0;
	}

	p {
		margin: 0;
		padding: 0;
		color: red;
		font-weight: bold;
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

	button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 2px 8px;
		margin: 0 16px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
	}
</style>
