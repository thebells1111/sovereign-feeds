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

	<div class="split-top">
		<label class="split-label">
			<h4>{selectedPerson['@_fee'] ? 'Percent' : 'Shares'}</h4>

			<input type="text" bind:value={selectedPerson['@_split']} placeholder="whole numbers only" />
		</label>
		<div class="fee">
			<h4>Fee</h4>
			<div class="fee-container">
				<label>
					<input type="radio" bind:group={selectedPerson['@_fee']} value={false} />
					No
				</label>

				<label>
					<input type="radio" bind:group={selectedPerson['@_fee']} value={true} />
					Yes
				</label>
			</div>
		</div>
	</div>
	<p>
		{selectedPerson['@_fee']
			? 'When fee is selected, the amount is a percent of the boost that is taken off the top before splitting amongst all the other splits. Use whole numbers only.'
			: "Shares are not percentages, they're shares of the total shares. Use whole numbers only."}
	</p>
</div>

<style>
	.person-block {
		margin: 8px 0 16px 0;
		width: 100%;
	}
	p {
		margin: 0;
		padding: 0;
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

	.split-top + p {
		text-align: left;
		margin: 0;
		padding: 0 0 0 8px;
		font-size: 0.9em;
		font-style: italic;
		text-align: center;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	.split-top {
		display: flex;
		justify-content: space-between;
	}

	.fee {
		display: flex;
		flex-direction: column;
		margin-left: 8px;
	}

	.fee-container {
		display: flex;
		padding: 8px;
	}

	.split-label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.fee-container > label {
		padding-right: 8px;
		margin-right: 12px;
		cursor: pointer;
		display: block;
		width: 48px;
	}
</style>
