<script>
	export let data;
	export let index;
	export let blank;
	export let title;
	import clone from 'just-clone';

	function incIndex() {
		index++;
		if (index === data.length) {
			index = 0;
		}
	}

	function decIndex() {
		index--;
		if (index < 0) {
			index = data.length - 1;
		}
	}

	function handleDelete(e) {
		data.splice(index, 1);
		if (index === data.length) {
			index--;
		}

		if (data.length === 0) {
			index = 0;
			data = [clone(blank)];
		}

		data = data;
	}

	$: if (index >= data.length) {
		index = 0;
	}
</script>

<index-scroller>
	{#if title}
		<h2>{title}</h2>
	{/if}
	<div class="selector-container">
		<button
			class="primary add"
			on:click={() => {
				data.push(clone(blank));
				index = data.length - 1;
				data = data;
			}}
		>
			Add New
		</button>

		{#if data.length}
			<div class="selector" style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
				<button
					style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}
					on:click={decIndex}>◀</button
				>
				<h3>
					{index + 1}
					of {data.length}
				</h3>
				<button
					style={`color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}
					on:click={incIndex}>▶</button
				>
			</div>
			<button class="primary delete" on:click={handleDelete}> Delete Current </button>
		{/if}
	</div>
</index-scroller>

<style>
	h2 {
		text-align: center;
		margin: 0;
		color: hsla(197, 100%, 43.7%, 1);
	}
	button.add {
		width: 121px;
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	button.delete {
		width: 121px;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
	}

	.selector-container {
		display: flex;
		align-items: center;
		margin: 8px;
		margin-left: 0;
		justify-content: center;
	}

	.selector {
		display: flex;
		align-items: center;
		margin: 0 8px;
	}
	.selector > h3 {
		margin: 0;
		padding: 0;
	}

	.selector > h3 {
		margin: 0;
		padding: 0;
	}
	.selector > button {
		margin: 0;
		background-color: transparent;
		outline: none;
		border: none;
	}
</style>
