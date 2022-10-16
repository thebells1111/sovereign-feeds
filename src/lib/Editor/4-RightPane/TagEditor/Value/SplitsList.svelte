<script>
	import Warning from '$lib/icons/Warning.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import clone from 'just-clone';
	export let data = {};
	export let index = 1;
	export let activeRecipient = {};
	export let showValues = false;

	let blankRecipient = {
		'@_name': 'New Split',
		'@_type': 'node',
		'@_address': '',
		'@_customKey': '',
		'@_customValue': '',
		'@_split': 0,
		'@_fee': false
	};

	$: splits = getSplitValue(data?.['podcast:valueRecipient']);

	function getSplitValue(recipient) {
		return recipient
			? recipient.reduce((acc, v) => (v?.['@_fee'] ? acc : acc + Number(v?.['@_split'])), 0)
			: 0;
	}

	function getSplitRecipients(recipients) {
		return recipients?.filter((v) => !v['@_fee']) || [];
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

	$: handleIndexChange(index);

	function handleIndexChange(index) {
		activeRecipient = data['podcast:valueRecipient'][index - 1];
	}
</script>

{#if splits !== 100}
	<p class="split-warning">
		<Warning color={'red'} size={'2em'} />
		<span>Remember: Non-fee splits need to add up to 100%</span>
	</p>
{/if}

<div class="splits-list">
	<div class="head">
		<h4>Splits</h4>
	</div>

	{#if getSplitRecipients(data?.['podcast:valueRecipient'])?.length}
		{#each getSplitRecipients(data['podcast:valueRecipient']) as r}
			<div
				class="splits-recepient"
				class:active={activeRecipient?.['@_name'] === r['@_name'] &&
					activeRecipient?.['@_address'] === r['@_address'] &&
					activeRecipient?.['@_customKey'] === r['@_customKey'] &&
					activeRecipient?.['@_customValue'] === r['@_customValue']}
				on:click={(e) => selectRecipient(r)}
			>
				<p>{r['@_split']}%</p>
				<p>{r['@_name']}</p>

				<button on:click|stopPropagation={handleDelete.bind(this, r)} class="delete"
					><Delete /></button
				>
			</div>
		{/each}
	{/if}

	<button on:click={addRecipient} class="primary add">Add New Split</button>

	{#if getSplitRecipients(data?.['podcast:valueRecipient'])?.length}
		<div class="splits-list-total">
			<p
				style={splits < 100
					? 'color:red; font-weight:700'
					: 'color:hsla(292, 100%, 33%, 1); font-weight:700'}
			>
				{splits}%
			</p>
			<p
				style={splits < 100
					? 'color:red; font-weight:700'
					: 'color:hsla(292, 100%, 33%, 1); font-weight:700'}
			>
				Total Split Percentage
			</p>

			<p class="spacer" />
		</div>
	{/if}
</div>

<style>
	.split-warning {
		position: relative;
		text-align: center;
	}

	.split-warning > span {
		position: relative;
		bottom: 8px;
		color: red;
		font-size: 14px;
		font-weight: 700;
	}

	.splits-list {
		padding-bottom: 8px;
		margin-bottom: 16px;
		margin-right: 8px;
		position: relative;
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

	.splits-recepient,
	.splits-list-total {
		display: flex;
		cursor: pointer;
		align-items: center;
	}
	.splits-recepient p:first-of-type,
	.splits-list-total p:first-of-type {
		width: 50px;
	}

	.splits-recepient p:nth-of-type(2),
	.splits-list-total p:nth-of-type(2) {
		font-size: 1.1em;
		font-weight: 600;
		text-align: left;
		width: 100%;
	}

	.splits-recepient p {
		padding: 4px 8px 4px 8px;
	}

	.splits-list-total p {
		padding: 4px 8px 4px 0;
	}

	.splits-list-total {
		border-top: 1px solid black;
		position: relative;
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
