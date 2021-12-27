<script>
	import { selectTextOnFocus } from '$functions/inputActions';
	import { rssData, editingEpisode, selectedPodcast } from '$/editor';

	let image;
	$: if ($selectedPodcast) {
		setTimeout(() => {
			srcset.width = image?.naturalWidth;
		}, 2500);
	}

	$: if ($editingEpisode) {
		setTimeout(() => {
			srcset.width = image?.naturalWidth;
		}, 250);
	}
	$: if (image) {
		image.onload = () => {
			srcset.width = image.naturalWidth;
		};
		image.onerror = () => {
			srcset.width = '';
		};
	}
	export let srcset;
	export let index;

	function handleInput(e) {
		data['@_srcset'][index].url = e.target.value;
		image.src = e.target.value;
		image = image;

		if (index === 0) {
			if (type === 'episode') {
				$editingEpisode['itunes:image']['@_href'] = e.target.value;
			} else {
				$rssData['itunes:image']['@_href'] = e.target.value;
			}
		}
	}
</script>

<img src={srcset.url} bind:this={image} />
<input
	class="url"
	type="text"
	on:input={handleInput}
	bind:value={srcset.url}
	use:selectTextOnFocus
/>
<span>{srcset.width} px</span>

<style>
	img {
		height: 50px;
		width: 50px;
		margin: 4px 8px 4px 0;
	}
	input {
		padding: 0;
		margin: 0;
		height: 30px;
		min-width: 10px;
	}

	.url {
		flex-grow: 1;
		padding: 0 8px;
	}

	span {
		margin: 0;
		width: 60px;
		text-align: right;
	}
</style>
