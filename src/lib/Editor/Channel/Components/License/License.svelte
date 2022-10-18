<script>
	import Select from 'svelte-select';
	import { rssData, licenses, selectedPodcast } from '$/editor';
	let licenseType;

	$: initializeLicense($selectedPodcast);

	async function initializeLicense() {
		let foundLicense = $licenses.find((v) => {
			let text = $rssData['podcast:license']['#text'] || '';
			return v?.value === text.toLowerCase();
		});

		let value = foundLicense?.value;

		if (!$rssData?.['podcast:license']?.['@_url']) {
			$rssData['podcast:license']['@_url'] = foundLicense?.url || '';
		}

		let slug = {
			value: value,
			label: value,
			url: $rssData['podcast:license']['@_url']
		};
		setLicense(slug);
		licenseType = value || '';
	}

	function setLicense(slug) {
		$rssData['podcast:license']['#text'] = slug.value;

		if (!slug.url) {
			let foundLicense = $licenses.find((v) => {
				return v?.value === $rssData?.['podcast:license']?.['#text']?.toLowerCase();
			});
			$rssData['podcast:license']['@_url'] = foundLicense?.url || '';
		} else {
			$rssData['podcast:license']['@_url'] = slug?.url;
		}
	}

	function handleSelect(event) {
		let slug = event.detail || [];
		setLicense(slug);
	}

	function handleClear(event) {
		$rssData['podcast:license']['#text'] = '';
	}
</script>

<h3>License</h3>
<h4>License Type</h4>
<Select
	items={$licenses}
	on:select={handleSelect}
	on:clear={handleClear}
	value={licenseType}
	isCreatable={true}
/>
<label>
	<h4>
		URL (url that points to the full, legal language of the license, required for custom license)
	</h4>
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

	h3,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
	h4 {
		margin-left: 8px;
	}
</style>
