<script>
	import Cancel from '$lib/icons/Cancel.svelte';
	import ImageBlock from './ImageBlock.svelte';

	export let data = {};
	export let type;

	function deleteImage(srcsetIndex, index) {
		data[srcsetIndex]['@_srcset'].splice(index, 1);
		if (data[srcsetIndex]['@_srcset'].length < 1) {
			data[srcsetIndex]['@_srcset'] = [{ url: '', width: '' }];
		}
		data = data;
	}

	function addImage(srcsetIndex) {
		data[srcsetIndex]['@_srcset'] = data[srcsetIndex]['@_srcset'].concat({ url: '', width: '' });
	}
</script>

<div class="images-container">
	{#each data as ratio, srcsetIndex}
		<h3>{ratio['@_aspect-ratio']}</h3>

		<h4>Image Url</h4>
		<input bind:value={ratio['@_src']} />
		<div class="srcset-container">
			{#if ratio['@_srcset']}
				<h3>Alternative Filesizes (ensure aspect ratio is consistent)</h3>
				<div class="header">
					<h4>Image URL</h4>
					<h4>Image Width</h4>
				</div>
				{#each [].concat(ratio['@_srcset']) as srcset, index}
					<div class="images-block">
						<ImageBlock {srcset} {index} {srcsetIndex} />
						{#if index === 0}
							<div class="delete-spacer" />
						{:else}
							<button class="delete" on:click={deleteImage.bind(this, srcsetIndex, index)}>
								<Cancel color={'red'} size={'24px'} />
							</button>
						{/if}
					</div>
					{#if index === 0}
						<p>
							⇧ Default Image URL, synced with {type[0].toUpperCase() + type.substring(1)}
							Metadata
						</p>
					{/if}
				{/each}
			{/if}
			<button class="add" on:click={addImage.bind(this, srcsetIndex)}>Add</button>
		</div>
	{/each}
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

	.header {
		width: 100%;
	}

	h4 {
		margin: 0;
		padding: 0;
		display: inline-block;
		color: hsla(352, 100%, 33%, 1);
	}

	.header > h4:nth-of-type(1) {
		margin-left: 60px;
	}

	.header > h4:nth-of-type(2) {
		float: right;
		margin-right: 8px;
	}

	.images-block {
		width: 100%;
		display: flex;
		align-items: center;
	}

	p {
		text-align: center;
		margin: 0 72px;
		padding: 0;
		position: relative;
		top: -10px;
		color: red;
	}

	.delete-spacer {
		width: 40px;
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
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
		width: 121px;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}
</style>
