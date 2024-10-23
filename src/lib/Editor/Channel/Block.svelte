<script>
	import { rssData, tagHeaders } from '$/editor';
	let slugList = [];
	let slugs = [];
	import Select from 'svelte-select';
	import { onMount } from 'svelte';

	async function getSlugList() {
		let res = await fetch(
			'https://raw.githubusercontent.com/Podcastindex-org/podcast-namespace/main/serviceslugs.txt'
		);
		let data = await res.text();
		slugList = data.split(/\r?\n/);
	}
	onMount(getSlugList);

	$: initializeBlockType($rssData?.['podcast:block']);

	function initializeBlockType(data) {
		if (data) {
			slugs = data
				.filter((v) => v['@_id'])
				.map((v) => {
					return { value: v['@_id'], label: v['@_id'] };
				});
		}
	}

	function handleSelect(event) {
		let slugs = event.detail || [];
		let text = $rssData['podcast:block'][0]['#text'] === 'no' ? 'yes' : 'no';
		$rssData['podcast:block'] = [
			$rssData['podcast:block'][0],
			...slugs.map((v) => {
				return { '#text': text, '@_id': v.value };
			})
		];
	}

	function handleChange() {
		let text = $rssData['podcast:block'][0]['#text'] === 'no' ? 'yes' : 'no';
		$rssData['podcast:block'] = [
			$rssData['podcast:block'][0],
			...slugs.map((v) => {
				return { '#text': text, '@_id': v.value };
			})
		];
	}
</script>

{#if $rssData && $rssData?.['podcast:block']}
	<h2>Block</h2>
	<div class="type-select">
		<label>
			<input
				type="radio"
				bind:group={$rssData['podcast:block'][0]['#text']}
				name="blockType"
				value="no"
				on:change={handleChange}
			/>
			<p>Nothing <br />(allows all players and directories)</p>
		</label>

		<label>
			<input
				type="radio"
				bind:group={$rssData['podcast:block'][0]['#text']}
				name="blockType"
				value="yes"
				on:change={handleChange}
			/>
			<p>Everything <br />(blocks all players and directories)</p>
		</label>
	</div>

	<div class="themed">
		<h4>
			However, {$rssData['podcast:block'][0]['#text'] === 'no' ? 'block' : 'allow'} the following players/directories
		</h4>
		<Select items={slugList} isMulti={true} value={slugs} on:select={handleSelect} />
	</div>
{/if}

<style>
	h2,
	h4 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.type-select {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	label {
		padding: 8px 32px;
		cursor: pointer;
		display: flex;
		align-items: flex-start;
	}

	input {
		margin: 16px 0px;
	}

	p {
		font-size: 1.1em;
	}

	input:checked + p {
		color: hsl(212, 100%, 39%);
		font-weight: 600;
	}
	ul {
		display: flex;
	}

	li {
		padding: 4px;
		margin: 4px;
		list-style: none;
		background-color: hsl(212, 100%, 39%);
	}

	.themed {
		--multiItemBG: hsl(212, 100%, 39%);
		color: white;
		font-weight: 550;
		--multiClearHoverFill: red;
		--itemHoverColor: var(--primary-text-color);
		--itemColor: var(--primary-text-color);
	}
</style>
