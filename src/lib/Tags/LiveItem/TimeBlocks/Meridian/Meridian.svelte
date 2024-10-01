<script>
	export let meridian = false;
	export let name = 'meridian';
</script>

<div>
	<label>
		<input type="radio" bind:group={meridian} {name} value={false} />
		am
	</label>

	<label>
		<input type="radio" bind:group={meridian} {name} value={true} />
		pm
	</label>
</div>

<style>
	div {
		height: 40px;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		width: 100px;
	}
</style>
