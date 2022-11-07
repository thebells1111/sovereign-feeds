<script>
	import Select from 'svelte-select';
	import { rssData, licenses, selectedPodcast, editingEpisode } from '$/editor';
	let licenseType;
	export let isEpisode = false;

	$: initializeLicense($selectedPodcast, $editingEpisode);

	async function initializeLicense() {
		if (isEpisode) {
			let foundLicense = $licenses.find((v) => {
				let text = $editingEpisode['podcast:license']['#text'] || '';
				return v?.value === text.toLowerCase();
			});

			let value = foundLicense?.value;

			if (!$editingEpisode?.['podcast:license']?.['@_url']) {
				$editingEpisode['podcast:license']['@_url'] = foundLicense?.url || '';
			}

			let slug = {
				value: value,
				label: value,
				url: $editingEpisode['podcast:license']['@_url']
			};
			setLicense(slug);
			licenseType = value || '';
		} else {
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
	}

	function setLicense(slug) {
		if (isEpisode) {
			$editingEpisode['podcast:license']['#text'] = slug.value;

			if (!slug.url) {
				let foundLicense = $licenses.find((v) => {
					return v?.value === $editingEpisode?.['podcast:license']?.['#text']?.toLowerCase();
				});
				$editingEpisode['podcast:license']['@_url'] = foundLicense?.url || '';
			} else {
				$editingEpisode['podcast:license']['@_url'] = slug?.url;
			}
		} else {
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
	}

	function handleSelect(event) {
		let slug = event.detail || [];
		setLicense(slug);
	}

	function handleClear(event) {
		if (isEpisode) {
			$editingEpisode['podcast:license']['#text'] = '';
		} else {
			$rssData['podcast:license']['#text'] = '';
		}
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
	{#if isEpisode}
		<input type="text" bind:value={$editingEpisode['podcast:license']['@_url']} />
	{:else}
		<input type="text" bind:value={$rssData['podcast:license']['@_url']} />
	{/if}
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
