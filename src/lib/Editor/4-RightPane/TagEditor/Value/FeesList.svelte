<script>
	import Delete from '$lib/icons/Delete.svelte';
	import clone from 'just-clone';
	export let data = {};
	export let index = 1;
	export let activeRecipient = {};
	let blankRecipient = {
		'@_name': 'New Fee',
		'@_type': 'node',
		'@_address': '',
		'@_customKey': '',
		'@_customValue': '',
		'@_split': 0,
		'@_fee': true
	};
	export let showValues = false;

	$: fees = getFeeValue(data?.['podcast:valueRecipient']);

	function getFeeValue(recipient) {
		return recipient
			? recipient?.reduce((acc, v) => (v?.['@_fee'] ? acc + Number(v?.['@_split']) : acc), 0)
			: 0;
	}

	function getFeeRecipients(recipients) {
		return recipients?.filter((v) => v['@_fee']) || [];
	}

	function getRecipientIndex(recipient) {
		let i = data['podcast:valueRecipient'].findIndex((r) => {
			return (
				r['@_name'] === recipient['@_name'] &&
				r['@_address'] === recipient['@_address'] &&
				r['@_customKey'] === recipient['@_customKey'] &&
				r['@_customValue'] === recipient['@_customValue']
			);
		});

		return i;
	}

	function selectRecipient(recipient) {
		let i = getRecipientIndex(recipient);

		if (i > -1) {
			index = i + 1;
			activeRecipient = recipient;
		}
		showValues = true;
	}

	function handleDelete(recipient) {
		let text = `Are you sure you want to delete ${recipient['@_name']}?`;
		if (confirm(text) == true) {
			let i = getRecipientIndex(recipient);
			data['podcast:valueRecipient'].splice(i, 1);
			if (i === data['podcast:valueRecipient'].length && index > 1) {
				index--;
			} else {
				index = data['podcast:valueRecipient'].length;
			}

			activeRecipient = data['podcast:valueRecipient'][index - 1];

			data = data;
		}
	}

	function addRecipient() {
		data['podcast:valueRecipient'] = data['podcast:valueRecipient'] || [];
		data['podcast:valueRecipient'].push(clone(blankRecipient));
		index = data['podcast:valueRecipient'].length;
		activeRecipient = data['podcast:valueRecipient'][index - 1];
		data = data;
		showValues = true;
	}
</script>

<div class="fees-list">
	<div class="head">
		<h4>Fees</h4>
	</div>

	{#if getFeeRecipients(data?.['podcast:valueRecipient'])?.length}
		{#each getFeeRecipients(data['podcast:valueRecipient']) as r}
			<div
				class="fees-recepient"
				class:active={activeRecipient?.['@_name'] === r['@_name'] &&
					activeRecipient?.['@_address'] === r['@_address'] &&
					activeRecipient?.['@_customKey'] === r['@_customKey'] &&
					activeRecipient?.['@_customValue'] === r['@_customValue']}
				on:click={(e) => selectRecipient(r)}
			>
				<p>{r['@_name']}</p>
				<p>{r['@_split']}%</p>
				<button on:click|stopPropagation={handleDelete.bind(this, r)} class="delete"
					><Delete /></button
				>
			</div>
		{/each}
	{/if}

	<button on:click={addRecipient} class="primary add">Add New Fee</button>

	{#if getFeeRecipients(data?.['podcast:valueRecipient'])?.length}
		<div class="fees-list-total">
			<p style={'color:hsla(292, 100%, 33%, 1); font-weight:700'}>Total fees Percentage:</p>
			<p style={'color:hsla(292, 100%, 33%, 1); font-weight:700'}>
				{fees}%
			</p>
			<p class="spacer" />
		</div>
	{/if}
</div>

<style>
	.fees-list {
		padding-bottom: 8px;
		margin-bottom: 16px;
		margin-right: 8px;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.head h4 {
		font-size: 1.1em;
		margin: 0;
		color: hsla(352, 100%, 43.7%, 1);
	}

	button.add {
		width: 150px;
		padding: 0;
		display: grid;
		place-content: center;
		position: relative;
		cursor: pointer;
		color: white;
		margin-left: calc(100% - 150px);
		margin-bottom: 4px;
	}

	.fees-recepient,
	.fees-list-total {
		display: flex;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
	}

	.fees-recepient p:first-of-type,
	.fees-list-total p:first-of-type {
		font-size: 1.1em;
		font-weight: 600;
		width: 60%;
	}

	.fees-recepient p {
		padding: 4px 8px 4px 8px;
	}

	.fees-list-total p {
		padding: 4px 8px 4px 0;
	}

	.fees-recepient p:nth-of-type(2),
	.fees-list-total p:nth-of-type(2) {
		width: 50px;
		text-align: center;
		padding: 4px 0;
	}

	.fees-list-total {
		border-top: 1px solid black;
	}

	.active p {
		color: hsla(197, 100%, 43.7%, 1);
	}

	.spacer {
		width: 32px;
	}

	button.delete {
		background-color: transparent;
		color: rgb(168, 168, 168);
		border: none;
		padding: 0;
		width: 32px;
	}
	button.delete:hover {
		color: red;
	}
</style>
