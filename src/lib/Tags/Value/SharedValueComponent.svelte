<script>
	import SplitsList from './SplitsList.svelte';
	import FeesList from './FeesList.svelte';
	import RecepientEditor from './RecepientEditor.svelte';

	export let data = {};
	let index = 1;
	let activeRecipient = data['podcast:valueRecipient']?.[index - 1];
	let showValues = false;

	export let support = true;

	// Check if Sovereign Feeds is not added
	$: noSF = (() => {
		try {
			const valueRecipient = data?.['podcast:valueRecipient'];

			if (Array.isArray(valueRecipient)) {
				return (
					valueRecipient.findIndex(
						(v) =>
							v?.['@_address'] ===
							'035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8'
					) === -1 &&
					valueRecipient.findIndex((v) => v?.['@_address'] === 'steven@curiohoster.com') === -1
				);
			}
			return true;
		} catch (error) {
			console.error('Error:', error);
			return false;
		}
	})();

	$: {
		try {
			const valueRecipient = data?.['podcast:valueRecipient'];
			const valueRecipientLength = valueRecipient?.length;

			if (index > valueRecipientLength) {
				index = valueRecipientLength || 1;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	$: shares = getSharesValue(data?.['podcast:valueRecipient']);

	function getSharesValue(recipient) {
		if (Array.isArray(recipient)) {
			return recipient.reduce((acc, v) => (v?.['@_fee'] ? acc : acc + Number(v?.['@_split'])), 0);
		} else {
			return 0;
		}
	}

	function addSovereignFeeds() {
		data['podcast:valueRecipient'].push({
			'@_name': 'Sovereign Feeds',
			'@_address': '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8',
			'@_type': 'node',
			'@_fee': true,
			'@_split': 5
		});
		data = data;
		index = data['podcast:valueRecipient'].length;
	}
</script>

<div class="persons-container">
	<div class="splits-container">
		{#if noSF && support}
			<button class="primary support" on:click={addSovereignFeeds}>
				Support Sovereign Feeds! Add us to your Value Block!
			</button>
		{/if}
		<SplitsList bind:data bind:index bind:activeRecipient bind:showValues {shares} />
		<FeesList bind:data bind:index bind:activeRecipient bind:showValues />
	</div>
</div>
<RecepientEditor bind:data bind:showValues bind:index />

<style>
	.persons-container {
		display: flex;
		margin-bottom: 8px;
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.splits-container {
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	button.primary {
		width: 80%;
		margin-left: 10%;
		margin-top: 8px;
	}

	button.primary {
		width: 80%;
		margin-left: 10%;
		margin-top: 8px;
	}
</style>
