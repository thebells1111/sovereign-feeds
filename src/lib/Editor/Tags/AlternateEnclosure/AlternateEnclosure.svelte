<script>
	import blankAlternateEnclosure from '$lib/Editor/_functions/blanks/alternateEnclosure.js';
	import clone from 'just-clone';
	import { rssData, editingEpisode } from '$/editor';
	import Add from '$lib/icons/Add.svelte';
	import Delete from '$lib/icons/Delete.svelte';

	function addEnclosure() {
		$editingEpisode['podcast:alternateEnclosure'].push(clone(blankAlternateEnclosure[0]));
		$editingEpisode['podcast:alternateEnclosure'] = $editingEpisode['podcast:alternateEnclosure'];
	}

	function addPodcastSource(index) {
		$editingEpisode['podcast:alternateEnclosure'][index]['podcast:source'].push({
			'@_uri': '',
			'@_contentType': ''
		});
		$editingEpisode['podcast:alternateEnclosure'] = $editingEpisode['podcast:alternateEnclosure'];
	}

	function deleteEnclosure(index) {
		$editingEpisode['podcast:alternateEnclosure'].splice(index, 1);

		if (!$editingEpisode['podcast:alternateEnclosure'].length) {
			$editingEpisode['podcast:alternateEnclosure'].push(clone(blankAlternateEnclosure[0]));
		}
		$editingEpisode['podcast:alternateEnclosure'] = $editingEpisode['podcast:alternateEnclosure'];
	}

	function deletePodcastSource(enclosureIndex, sourceIndex) {
		$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['podcast:source'].splice(
			sourceIndex,
			1
		);
		if (!$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['podcast:source'].length) {
			$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['podcast:source'].push({
				'@_uri': '',
				'@_contentType': ''
			});
		}
		$editingEpisode['podcast:alternateEnclosure'] = $editingEpisode['podcast:alternateEnclosure'];
	}
</script>

{#if $rssData && $editingEpisode?.['podcast:alternateEnclosure'] && $editingEpisode?.['podcast:alternateEnclosure']?.[0]?.['podcast:source']?.length}
	<enclosure-header>
		<h1>Alternate Enclosures</h1>
		<button class="add" on:click={addEnclosure}>
			<Add size="32" />
		</button>
	</enclosure-header>
	{#each $editingEpisode?.['podcast:alternateEnclosure'] as enclosure, enclosureIndex}
		<enclosure-title>
			<h2>Enclosure #{enclosureIndex + 1}</h2>
			<button class="delete" on:click={() => deleteEnclosure(enclosureIndex)}>
				<Delete size="24" />
			</button>
		</enclosure-title>
		<source-header>
			<h3>Sources</h3>
			<button class="add" on:click={() => addPodcastSource(enclosureIndex)}>
				<Add size="32" />
			</button>
		</source-header>
		{#each enclosure?.['podcast:source'] as source, sourceIndex}
			<source-data>
				<source-title>
					<h4>Source #{sourceIndex + 1}</h4>
					<button class="delete" on:click={() => deletePodcastSource(enclosureIndex, sourceIndex)}>
						<Delete size="24" />
					</button>
				</source-title>
				<source-group>
					<label>
						Source URI
						<input type="text" bind:value={source['@_uri']} required placeholder="required" />
					</label>
					<label>
						Content Type
						<input type="text" bind:value={source['@_contentType']} placeholder="optional" />
					</label>
				</source-group>
			</source-data>
		{/each}
		<enclosure-data>
			<h3>Enclosure Data</h3>
			<enclosure-group>
				<label>
					Type
					<input type="text" bind:value={enclosure['@_type']} required placeholder="required" />
				</label>
				<label>
					Length
					<input type="text" bind:value={enclosure['@_length']} placeholder="optional" />
				</label>
				<label>
					Bitrate
					<input type="text" bind:value={enclosure['@_bitrate']} placeholder="optional" />
				</label>

				<label>
					Height
					<input type="text" bind:value={enclosure['@_height']} placeholder="optional" />
				</label>
			</enclosure-group>
			<enclosure-group>
				<label>
					Language
					<input type="text" bind:value={enclosure['@_lang']} placeholder="optional" />
				</label>
				<label>
					Rel
					<input type="text" bind:value={enclosure['@_rel']} placeholder="optional" />
				</label>

				<label>
					Codecs
					<input type="text" bind:value={enclosure['@_codecs']} placeholder="optional" />
				</label>
				<label>
					Default
					<input type="text" bind:value={enclosure['@_default']} placeholder="optional" />
				</label>
			</enclosure-group>
		</enclosure-data>
	{/each}
{/if}

<style>
	enclosure-header,
	enclosure-title,
	source-title,
	source-header {
		display: flex;
		align-items: center;
	}

	enclosure-title {
		margin-left: 12px;
	}

	source-data,
	enclosure-data {
		display: block;
		margin-left: 24px;
	}

	enclosure-group > label source-title,
	source-group {
		margin-left: 12px;
	}

	source-group > label:first-of-type {
		width: calc(75% - 8px);
	}

	enclosure-data > enclosure-group {
		margin-left: 12px;
	}

	label {
		display: flex;
		flex-direction: column;
	}

	h1,
	h2,
	h3,
	h4 {
		margin: 0;
	}

	source-data {
		margin-top: 8px;
		margin-bottom: 8px;
	}
	source-header {
		margin-bottom: 8px;
	}

	label {
		margin-right: 8px;
		width: calc(25% - 8px);
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 0 0 8px;
		padding: 0;
		border-radius: 100%;
		background-color: transparent;
		border: none;
		color: var(--primary-button-color-light);
	}

	button.delete {
		color: gray;
		align-items: flex-end;
	}

	button.delete:hover {
		color: red;
	}

	source-group,
	enclosure-group {
		display: flex;
	}
</style>
