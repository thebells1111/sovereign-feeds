<script>
	import IndexScroll from '../Shared/IndexScroll.svelte';
	import SourceBlock from './SourceBlock.svelte';

	import { editingEpisode } from '$/editor';

	export let enclosureIndex = 0;

	let sourceIndex = 0;
</script>

<enclosure-container>
	<enclosure-data>
		<h3>Enclosure Data</h3>
		<enclosure-group>
			<label>
				Type
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_type']}
					required
					placeholder="required"
				/>
			</label>
			<label>
				Length
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_length']}
					placeholder="optional"
				/>
			</label>
			<label>
				Bitrate
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_bitrate']}
					placeholder="optional"
				/>
			</label>

			<label>
				Height
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_height']}
					placeholder="optional"
				/>
			</label>
		</enclosure-group>
		<enclosure-group>
			<label>
				Language
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_lang']}
					placeholder="optional"
				/>
			</label>
			<label>
				Rel
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_rel']}
					placeholder="optional"
				/>
			</label>

			<label>
				Codecs
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_codecs']}
					placeholder="optional"
				/>
			</label>
			<label>
				Default
				<input
					type="text"
					bind:value={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['@_default']}
					placeholder="optional"
				/>
			</label>
		</enclosure-group>
	</enclosure-data>
	<source-container>
		<IndexScroll
			bind:data={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['podcast:source']}
			bind:index={sourceIndex}
			title={`Alternate Enclosure #${sourceIndex + 1} Sources`}
			blank={{
				'@_uri': '',
				'@_contentType': ''
			}}
		/>
		<SourceBlock
			bind:source={$editingEpisode['podcast:alternateEnclosure'][enclosureIndex]['podcast:source'][
				sourceIndex
			]}
		/>
	</source-container>
</enclosure-container>

<style>
	enclosure-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	enclosure-data {
		display: flex;
		flex-direction: column;
		height: 100%;
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

	label {
		margin-right: 8px;
		width: calc(25% - 8px);
	}

	enclosure-group {
		display: flex;
	}
</style>
