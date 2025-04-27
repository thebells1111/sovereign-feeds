<script>
	import { digitalOceanEnabled } from '$/editor';
	export let data;
	export let index = 5;
	export let title;
	export let subtitle;
	export let noStyle = false;
	export let showUpload;
	export let showUploadButton = false;
</script>

<div class="block">
	<label>
		<div class="heading">
			<div class="left">
				<h4 style={noStyle ? '' : `color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
					{title}
				</h4>

				{#if $digitalOceanEnabled && showUploadButton}
					<button
						on:click={() => {
							showUpload = true;
						}}
					>
						Upload
					</button>
				{/if}
			</div>
			{#if subtitle}
				<p style={noStyle ? '' : `color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
					{subtitle}
				</p>
			{/if}
		</div>
		<input type="text" bind:value={data} />
	</label>
</div>

<style>
	.block {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
		padding: 0 4px;
	}
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	@keyframes animate {
		0% {
			opacity: 1;
		}

		10% {
			opacity: 0;
		}

		15% {
			opacity: 1;
		}

		100% {
			opacity: 1;
		}
	}

	label > div {
	}

	.left {
		display: flex;
		align-items: center;
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
		box-shadow:
			inset 0 1px hsla(0, 0%, 42.7%, 1),
			0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow:
			1px 4px 6px rgb(82, 82, 82),
			0 0 0 #000,
			1px 4px 6px rgb(82, 82, 82);
	}

	p {
		margin: 0;
		padding: 0 4px;
	}
</style>
