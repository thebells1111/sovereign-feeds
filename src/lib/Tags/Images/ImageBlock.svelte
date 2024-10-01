<script>
	import { selectTextOnFocus } from '$functions/inputActions';
	import { rssData, editingEpisode, selectedPodcast } from '$/editor';

	let image;
	$: if (imgSrc?.url) {
		setTimeout(() => {
			imgSrc.width = image?.naturalWidth;
		}, 250);
	}

	$: if (image) {
		image.onload = () => {
			if (imgSrc.hasOwnProperty('url')) {
				imgSrc.width = image?.naturalWidth;
			}
		};
		image.onerror = () => {
			if (imgSrc.hasOwnProperty('url')) {
				imgSrc.width = '';
			}
		};
	}
	export let imgSrc;
	let imageUrl;

	$: console.log('src: ', imgSrc);

	function handleInput(e) {
		if (imgSrc.hasOwnProperty('url')) {
			imgSrc.url = e.target.value;
		} else {
			imgSrc = e.target.value;
		}

		$rssData = $rssData;
	}

	$: if (imgSrc) {
		imageUrl = imgSrc.url || imgSrc || '';
	} else {
		imageUrl = '';
	}
</script>

<div>
	<img src={imageUrl} bind:this={image} />
</div>
<input class="url" type="text" on:input={handleInput} bind:value={imageUrl} use:selectTextOnFocus />

<style>
	div {
		height: 50px;
		margin: 4px 0;
		display: flex;
		align-items: center;
		border: 1px solid black;
		margin: 4px 8px 4px 0;
	}
	img {
		width: 50px;
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
