<script>
	export let src = '';
	export let style = '';
	export let alt = '';
	export let errorImg = '';
	let img;

	import { proxy } from '$/editor';

	$: if (src && img) {
		styleImage();
	} else if (img && !src) {
		img.src = '';
		img.alt = alt;
		img.style = style;
	}

	function styleImage() {
		if (src.includes('https')) {
			img.src = src;
		} else {
			if (src.includes(window.location.origin)) {
				img.src = src;
			} else {
				img.src = proxy + encodeURIComponent(src);
			}
		}
		img.alt = alt;
		img.style = style;
	}

	function handleErr(err) {
		// src = errorImg;
		// console.log(err);
	}
</script>

<!-- svelte-ignore a11y-missing-attribute -->

<img on:error={handleErr} bind:this={img} />
