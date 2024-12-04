<script>
	export let selectedPerson = {};
</script>

<div class="person-block">
	<label>
		<h4>Value Recipient Name</h4>
		<input
			type="text"
			bind:value={selectedPerson['@_name']}
			placeholder="Choose a name so people can send Boostagrams"
		/>
	</label>
	<label>
		<h4>Lightning Network URL</h4>
		<input
			type="text"
			bind:value={selectedPerson['@_address']}
			placeholder="Lightning Network URL"
		/>
	</label>
</div>

<style>
	.person-block {
		margin: 8px 0 16px 0;
		width: 100%;
	}

	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 43.7%, 1);
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
