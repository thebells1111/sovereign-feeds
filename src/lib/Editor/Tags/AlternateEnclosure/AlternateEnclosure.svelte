<script>
	import blankAlternateEnclosure from '$lib/Editor/_functions/blanks/alternateEnclosure.js';
	import clone from 'just-clone';
	import { rssData, editingEpisode } from '$/editor';

	let enclosures = [clone(blankAlternateEnclosure[0])];

	function addEnclosure() {
		enclosures.push(clone(blankAlternateEnclosure[0]));
	}

	function addPodcastSource(index) {
		enclosures[index]['podcast:source'].push({ '@_uri': '', '@_contentType': '' });
	}

	function deleteEnclosure(index) {
		enclosures.splice(index, 1);
	}

	function deletePodcastSource(enclosureIndex, sourceIndex) {
		enclosures[enclosureIndex]['podcast:source'].splice(sourceIndex, 1);
	}
</script>

{#if $rssData && $editingEpisode?.['podcast:alternateEnclosure']}
	{#each $editingEpisode?.['podcast:alternateEnclosure'] as enclosure, enclosureIndex}
		<enclosure-header>
			<h1>Alternate Enclosures</h1>
			<button on:click={addEnclosure}>Add Enclosure</button>
		</enclosure-header>
		{#each enclosure?.['podcast:source'] as source, sourceIndex}
			<enclosure-title>
				<h2>Enclosure #{enclosureIndex + 1}</h2>
				<button on:click={() => deleteEnclosure(enclosureIndex)}>Delete Enclosure</button>
			</enclosure-title>
			<div>
				<source-header>
					<h2>Sources</h2>
					<button on:click={() => addPodcastSource(enclosureIndex)}>Add Source</button>
				</source-header>
				<source-title>
					<h2>Source #{sourceIndex + 1}</h2>
					<button on:click={() => deletePodcastSource(enclosureIndex, sourceIndex)}
						>Delete Source</button
					>
				</source-title>
				<label
					>Source URI: <input
						type="text"
						bind:value={source['@_uri']}
						required
						placeholder="required"
					/></label
				>
				<label
					>Content Type: <input
						type="text"
						bind:value={source['@_contentType']}
						placeholder="optional"
					/></label
				>
			</div>
		{/each}

		<div>
			<h2>Enclosure Data</h2>
			<label
				>Type: <input
					type="text"
					bind:value={enclosure['@_type']}
					required
					placeholder="required"
				/></label
			>
			<label
				>Length: <input
					type="text"
					bind:value={enclosure['@_length']}
					placeholder="optional"
				/></label
			>
			<label
				>Bitrate: <input
					type="text"
					bind:value={enclosure['@_bitrate']}
					placeholder="optional"
				/></label
			>
			<label
				>Height: <input
					type="text"
					bind:value={enclosure['@_height']}
					placeholder="optional"
				/></label
			>
			<label
				>Language: <input
					type="text"
					bind:value={enclosure['@_lang']}
					placeholder="optional"
				/></label
			>
			<label
				>Rel: <input type="text" bind:value={enclosure['@_rel']} placeholder="optional" /></label
			>
			<label
				>Codecs: <input
					type="text"
					bind:value={enclosure['@_codecs']}
					placeholder="optional"
				/></label
			>
			<label
				>Default: <input
					type="text"
					bind:value={enclosure['@_default']}
					placeholder="optional"
				/></label
			>
		</div>
	{/each}
{/if}

<style>
	enclosure-header,
	enclosure-title,
	source-title,
	source-header {
		display: flex;
	}
	.enclosure {
		border: 1px solid #ddd;
		padding: 10px;
		margin-bottom: 10px;
	}
	.source {
		margin-left: 20px;
	}
</style>
