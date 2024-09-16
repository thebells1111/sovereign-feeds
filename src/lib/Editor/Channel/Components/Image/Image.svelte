<script>
	import { rssData, tagHeaders, digitalOceanEnabled } from '$/editor';
	import Upload from '$lib/Upload/Upload.svelte';
	export let size = '75px';
	let showUpload = false;
	let fileName;

	$: if (fileName) {
		handleInput({ target: { value: fileName } });
	}

	function handleInput(e) {
		$rssData['itunes:image']['@_href'] = e.target.value;
		$rssData['podcast:images']['@_srcset'][0].url = e.target.value;
	}
</script>

<div class="podcast-image">
	<label>
		<div class="left">
			<h3>{$tagHeaders.channel.artwork}</h3>
			{#if $digitalOceanEnabled}
				<button
					on:click={() => {
						showUpload = true;
					}}
				>
					Upload
				</button>
			{/if}
		</div>

		<input
			type="text"
			value={$rssData?.['itunes:image']?.['@_href']}
			on:input={handleInput}
			placeholder="Copy Link Address to Cover Art File (file should be served from a https server)"
		/>
	</label>
	<img src={$rssData?.['itunes:image']?.['@_href']} style={`height: ${size}; width: ${size}`} />
</div>
{#if showUpload}
	<Upload path={`art`} bind:fileName bind:showUpload />
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	.podcast-image {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	img {
		margin: 0 0 0 8px;
	}

	label > div {
		display: flex;
		align-items: center;
	}

	.left {
		display: flex;
	}

	button {
		background-color: #333;
		margin: 8px 0 4px 16px;
		color: #eee;
		padding: 2px 8px;
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
