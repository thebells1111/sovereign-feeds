<script>
	export let data = {};
	export let index = 1;
	export let title = '';
	export let min = 0;
	export let max = Infinity;
	export let noStyle = false;
</script>

<div class="block">
	<label>
		<div class="heading">
			<h4 style={noStyle ? '' : `color: hsla(${352 - ((index + 1) % 6) * 60}, 100%, 33%, 1)`}>
				{title}
			</h4>
		</div>
		<input type="number" {min} {max} bind:value={data} />
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
</style>
