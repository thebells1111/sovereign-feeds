<script>
	import Select from 'svelte-select';
	import { rssData, licenses } from '$/editor';
	console.log($rssData);
	console.log($licenses);
	let selectedLicense;

	$: initializeBlockType($rssData?.['podcast:license']?.['#text'], $licenses);

	$: console.log(selectedLicense);

	function initializeBlockType(data, licenseList) {
		console.log(data);
		console.log(licenseList);

		if (data && licenseList && selectedLicense?.licenseId?.toLowerCase() !== data?.toLowerCase()) {
			selectedLicense = licenseList.find((v) => v.licenseId.toLowerCase() === data.toLowerCase());
			$rssData['podcast:license']['#text'] = data;
			$rssData['podcast:license']['@_url'] = selectedLicense.reference;
		}
	}

	function handleSelect(event) {
		let slug = event.detail || [];
	}
</script>

<label>
	<h3>License</h3>
	<Select
		items={$licenses}
		labelIdentifier="licenseId"
		value={selectedLicense}
		on:select={handleSelect}
	/>
	<input type="text" bind:value={$rssData['podcast:license']['@_url']} />
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
