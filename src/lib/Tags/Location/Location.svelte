<script>
	import blankLocation from './blankLocation';
	import TextBlock from '$lib/Tags/Shared/TextBlock.svelte';
	import IndexScroll from '$lib/Tags/Shared/IndexScroll.svelte';
	export let data;
	let index = 0;

	const relOptions = [
		{ value: 'subject', label: 'subject - The location refers to what/where the content is about' },
		{
			value: 'creator',
			label: 'creator - The location refers to where the content was recorded or produced.'
		}
	];
	function handleRelChange(e) {
		data[index]['@_rel'] = e.target.value;
	}
</script>

<div class="container">
	<IndexScroll bind:data bind:index blank={blankLocation} title={'Location'} />
	<a href="https://github.com/Podcastindex-org/podcast-namespace/blob/main/location/location.md">
		What is this tag?
	</a>
	<div class="blocks-container">
		{#if data && data.length > 0 && index < data.length}
			<TextBlock
				title="Display Name (required, max 128 chars)"
				{index}
				bind:data={data[index]['#text']}
			/>
			<div class="radio-group">
				<h4 style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
					Relation (optional)
				</h4>

				{#each relOptions as option}
					<label>
						<input
							type="radio"
							name="rel-{index}"
							value={option.value}
							checked={data[index]['@_rel'] === option.value}
							on:change={handleRelChange}
						/>
						{option.label}
					</label>
				{/each}
			</div>

			<TextBlock
				title="Geo (optional)"
				subtitle="format: geo:lat,lon (geo:30.2672,97.7431)"
				{index}
				bind:data={data[index]['@_geo']}
			/>

			<TextBlock
				title="OSM (optional, OpenStreetMap ID)"
				{index}
				bind:data={data[index]['@_osm']}
			/>

			<TextBlock
				title="Country (optional, 2-letter code)"
				{index}
				bind:data={data[index]['@_country']}
			/>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
	}

	.blocks-container {
		overflow: auto;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		margin: 8px 0;
		position: relative;
	}

	.radio-group h4 {
		margin: 0;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 4px 4px;
		cursor: pointer;
	}

	.radio-group input {
		margin: 0;
		position: relative;
		top: 2px;
	}
	a {
		margin: 4px auto;
	}
</style>
