<script>
	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import PlaylistAdd from '$lib/icons/PlaylistAdd.svelte';
</script>

<div class="container">
	<button class="load-episode-button  episode-button">
		<PlayArrow size="36px" />
	</button>

	<div class="placeholder" />

	<button class="add-button episode-loading-button"><PlaylistAdd size="30px" /></button>
	<div class="shimmer" />
</div>

<style>
	.container {
		margin: 0 8px;
		border-bottom: 1px solid var(--border-color);
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		height: 50px;
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.placeholder {
		width: 100%;
		height: 1.5em;
		margin: 0 0.5em;
		background-color: var(--primary-color);
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		color: #ddd;
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
			to(#fff)
		);
		background: -o-linear-gradient(left, rgba(255, 255, 255, 0) 20%, #fff 100%);
		background: linear-gradient(90deg, rgba(255, 255, 255, 0) 20%, #fff 100%);
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
			from(#fff),
			color-stop(20%, rgba(255, 255, 255, 0))
		);
		background: -o-linear-gradient(left, #fff 0%, rgba(255, 255, 255, 0) 20%);
		background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 20%);
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
