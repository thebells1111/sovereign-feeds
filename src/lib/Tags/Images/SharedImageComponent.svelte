<script>
	import Cancel from '$lib/icons/Cancel.svelte';
	import ImageBlock from './ImageBlock.svelte';

	export let data = {};

	let selectedRatioIndex = data.length > 0 ? 0 : null;

	function deleteSrcSetImage(srcsetIndex, index) {
		data[srcsetIndex]['@_srcset'].splice(index, 1);
		data = data; // Trigger reactivity
	}

	function addSrcSetImage(srcsetIndex) {
		data[srcsetIndex]['@_srcset'].push({ url: '', width: '' });
		data = data;
	}

	function handleRadioChange(index) {
		selectedRatioIndex = index; // Update the selected index
	}

	function getCommonName(ratio) {
		let commonNames = {
			'1/1': 'Square',
			'3/1': 'Cover Photo',
			'16/9': 'Wide Screen',
			'4/3': 'Standard Screen',
			'15/1': 'Banner'
		};
		return commonNames[ratio] || '';
	}
</script>

<div class="images-container">
	<h3>Aspect Ratio Image</h3>
	<div class="radio-group">
		{#each data as ratio, srcsetIndex}
			<label class:selected={selectedRatioIndex === srcsetIndex}>
				<input
					type="radio"
					name="aspect-ratio"
					checked={selectedRatioIndex === srcsetIndex}
					on:change={() => handleRadioChange(srcsetIndex)}
				/>
				<div>
					<p>Aspect Ratio {ratio['@_aspect-ratio'].replace('/', ':')}</p>
					<p>{getCommonName(ratio['@_aspect-ratio'])}</p>
				</div>
			</label>
		{/each}
	</div>

	{#if selectedRatioIndex !== null}
		<div class="header">
			<h4>Image URL</h4>
		</div>
		<div class="images-block">
			<ImageBlock bind:imgSrc={data[selectedRatioIndex]['@_src']} />
		</div>
		{#if data[selectedRatioIndex]['@_src']}
			<div class="srcset-container">
				<h3>Alternative Filesizes (ensure aspect ratio is consistent)</h3>
				{#if data[selectedRatioIndex]['@_srcset'].length}
					<div class="header">
						<h4>Image URL</h4>
					</div>
					{#each data[selectedRatioIndex]['@_srcset'] as srcset, index}
						<div class="images-block">
							<ImageBlock bind:imgSrc={srcset.url} />

							<button
								class="delete"
								on:click={deleteSrcSetImage.bind(this, selectedRatioIndex, index)}
							>
								<Cancel color={'red'} size={'24px'} />
							</button>
						</div>
					{/each}
				{/if}
				<button class="add" on:click={addSrcSetImage.bind(this, selectedRatioIndex)}>Add</button>
			</div>{/if}
	{/if}
</div>

<style>
	.images-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.radio-group {
		margin: 8px;
		display: flex;
		flex-wrap: wrap;
	}

	.radio-group > label {
		margin: 0 8px 8px 8px;
		cursor: pointer;
		width: 160px;
		height: 45px;
		display: flex;
		justify-content: center;
		user-select: none;
	}

	.radio-group > label > div > p {
		margin: 0;
		padding: 0;
		text-align: center;
	}

	.radio-group > label > input {
		display: none;
	}

	.selected {
		font-weight: bold; /* Bold font for selected ratio */

		border-bottom: 2px solid rgb(27, 111, 246);
	}

	.selected p {
		color: rgb(27, 111, 246);
	}

	.header {
		width: 100%;
	}

	h4 {
		margin: 0;
		padding: 0;
		display: inline-block;
		color: hsla(352, 100%, 33%, 1);
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.images-block {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.delete {
		background-color: transparent;
		border: none;
		padding: 0 8px;
		margin: 0;
		transform: scale(1);
		transition-duration: 0.2s;
	}

	.delete:hover {
		transform: scale(1.2);
		transition-duration: 0.2s;
	}

	button.add {
		align-self: flex-end;
		padding: 2px 8px;
		margin: 0 8px;
		color: #f0f0f0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		width: 121px;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}
</style>
