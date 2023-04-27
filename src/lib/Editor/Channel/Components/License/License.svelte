<script>
	import { afterUpdate } from 'svelte';
	import Select from 'svelte-select';
	import { rssData, licenses, selectedPodcast, editingEpisode } from '$/editor';
	let licenseType;
	export let isEpisode = false;

	let editingEpisodeUrl = '';
	let rssDataUrl = '';

	afterUpdate(initializeLicense);

	async function initializeLicense() {
		if (isEpisode) {
			if (!$editingEpisode) $editingEpisode = {};
			if (!$editingEpisode['podcast:license']) {
				$editingEpisode['podcast:license'] = { '#text': '', '@_url': '' };
			}
			let foundLicense = $licenses.find((v) => {
				let text = $editingEpisode?.['podcast:license']?.['#text'] || '';
				return v?.value === text?.toLowerCase();
			});

			let value = foundLicense?.value;

			editingEpisodeUrl = foundLicense?.url || '';

			let slug = {
				value: value,
				label: value,
				url: editingEpisodeUrl
			};
			setLicense(slug);
			licenseType = value || '';
		} else {
			if (!$rssData) $rssData = {};
			if (!$rssData['podcast:license']) {
				$rssData['podcast:license'] = { '#text': '', '@_url': '' };
			}
			let foundLicense = $licenses.find((v) => {
				let text = $rssData['podcast:license']['#text'] || '';
				return v?.value === text.toLowerCase();
			});

			let value = foundLicense?.value;

			rssDataUrl = foundLicense?.url || '';

			let slug = {
				value: value,
				label: value,
				url: rssDataUrl
			};
			setLicense(slug);
			licenseType = value || '';
		}
	}

	function setLicense(slug) {
		if (isEpisode) {
			$editingEpisode['podcast:license']['#text'] = slug.value;
			editingEpisodeUrl = slug?.url || '';
		} else {
			$rssData['podcast:license']['#text'] = slug.value;
			rssDataUrl = slug?.url || '';
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

	function handleUrlChange(url) {
		if (isEpisode && $editingEpisode?.['podcast:license']) {
			$editingEpisode['podcast:license']['@_url'] = url;
		} else if ($rssData?.['podcast:license']) {
			$rssData['podcast:license']['@_url'] = url;
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
		<input
			type="text"
			bind:value={editingEpisodeUrl}
			on:input={() => handleUrlChange(editingEpisodeUrl)}
		/>
	{:else}
		<input type="text" bind:value={rssDataUrl} on:input={() => handleUrlChange(rssDataUrl)} />
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
