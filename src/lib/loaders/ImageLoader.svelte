<script>
	import { onMount } from 'svelte';
	export let url = '';
	export let alt = 'image';
	export let title = '';

	export let imageSize = 320;
	export let imageWidth = imageSize;
	export let imageHeight = imageSize;
	export let placeholderWidth = imageSize;
	export let placeholderHeight = imageSize;
	export let styling = '';
	let image;
	let loaded = false;
	let showBlankImage;
	import { proxy } from '$/editor';

	onMount(() => {
		loadImage();
	});

	$: loadImage(url);

	function loadImage() {
		loaded = false;
		showBlankImage = false;
		if (image) {
			image.style.cssText = `display: none;`;
			console.log(url);
			if (url && url === 'none') {
				imageError();
			} else if (url && url !== 'waiting') {
				if (url.includes('https')) {
					image.src = url;
				} else {
					image.src = proxy + encodeURIComponent(url);
				}

				image.onload = () => {
					loaded = true;
					showBlankImage = false;
					if (image) {
						image.style.cssText = `width: ${imageWidth}px; height: ${imageHeight}px;` + styling;
					}
				};
				image.onerror = imageError;
			}
		}
	}

	function imageError() {
		loaded = true;
		showBlankImage = true;
		image.style.cssText = 'display: none;';
	}
</script>

<img src="" {alt} bind:this={image} style="display: none;" />
{#if showBlankImage}
	<div
		class="blank-image"
		style={`width: ${placeholderWidth}px; height: ${placeholderHeight}px; ${styling}`}
	>
		<p>{title}</p>
	</div>
{/if}

{#if !loaded}
	<slot>
		<div
			class="placeholder"
			style={`width: ${placeholderWidth}px; height: ${placeholderHeight}px; ${styling}`}
		>
			<div class="shimmer" />
		</div>
	</slot>
{/if}

<style>
	.placeholder {
		position: relative;
		background-color: #f9f9f9;
		overflow: hidden;
	}

	.blank-image {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: 700;
		background-color: #333;
		color: #eee;
	}

	p {
		padding: 0;
	}
	.shimmer {
		width: 100%;
		height: 150%;
		-webkit-animation: loading 1s linear infinite;
		animation: loading 1s linear infinite;
		position: absolute;
		top: -30%;
		left: 0;
	}
	.shimmer:before {
		content: '';
		position: absolute;
		top: 0;
		left: 25%;
		width: 25%;
		height: 100%;
		background: -webkit-gradient(
			linear,
			left top,
			right top,
			color-stop(20%, rgba(255, 255, 255, 0)),
			to(#e5e5e5)
		);
		background: -o-linear-gradient(left, rgba(255, 255, 255, 0) 20%, #e5e5e5 100%);
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 20%, #e5e5e5 100%);
	}
	.shimmer:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		background: -webkit-gradient(
			linear,
			left top,
			right top,
			from(#e5e5e5),
			color-stop(20%, rgba(255, 255, 255, 0))
		);
		background: -o-linear-gradient(left, #e5e5e5 0%, rgba(255, 255, 255, 0) 20%);
		background: linear-gradient(90deg, #e5e5e5 0%, rgba(255, 255, 255, 0) 20%);
	}
	img {
		-webkit-animation: fadein 1s forwards;
		animation: fadein 1s forwards;
	}
	@-webkit-keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@-webkit-keyframes loading {
		from {
			-webkit-transform: translateX(-100%) rotate(30deg);
			transform: translateX(-100%) rotate(30deg);
		}
		to {
			-webkit-transform: translateX(100%) rotate(30deg);
			transform: translateX(100%) rotate(30deg);
		}
	}
	@keyframes loading {
		from {
			-webkit-transform: translateX(-100%) rotate(30deg);
			transform: translateX(-100%) rotate(30deg);
		}
		to {
			-webkit-transform: translateX(100%) rotate(30deg);
			transform: translateX(100%) rotate(30deg);
		}
	}
</style>
