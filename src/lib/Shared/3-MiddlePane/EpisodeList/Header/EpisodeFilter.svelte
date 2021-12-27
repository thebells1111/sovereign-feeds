<script>
	import { slide } from 'svelte/transition';
	import sortEpisodes from '$functions/sortEpisodes';

	import { episodeSelector, filteredEpisodesList, episodesList } from '$/stores';

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'episodes-filter-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	function handleCompleteStatusChange() {
		$filteredEpisodesList = sortEpisodes($episodesList, $episodeSelector.sorter, {
			complete: $episodeSelector.completeStatus
		});
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div>
	<button
		id="episodes-filter-button"
		on:click={handleSettingsClick}
		aria-label="episodes-filter-button">filter episodes</button
	>
	{#if showList}
		<ul on:click={handleUlClick} transition:slide={{ duration: 200 }}>
			<li>
				<label class="checkbox">
					<span>filter completed episodes</span>
					<input
						type="checkbox"
						bind:checked={$episodeSelector.completeStatus}
						on:change={handleCompleteStatusChange}
					/>
				</label>
			</li>
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 36px;
		padding: 0;
	}
	ul {
		background-color: var(--tertiary-color);
		color: var(--text-color);
		border-radius: 3px;
		width: 215px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 40px;
		left: 4px;
		overflow: hidden;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		z-index: 3;
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 8px;
		line-height: 42px;
	}
	li:hover {
		background-color: var(--text-color);
		color: var(--tertiary-color);
	}

	button {
		background-color: transparent;
		margin: 0;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		padding: 0 16px;
		height: 35.78px;
	}

	.checkbox {
		display: inline-flex;
		cursor: pointer;
		position: relative;
		height: 100%;
		width: 100%;
		align-items: center;
	}

	.checkbox > span {
		padding-right: 0.25em;
	}

	.checkbox > input {
		height: 15px;
		width: 15px;
		-webkit-appearance: none;
		-moz-appearance: none;
		-o-appearance: none;
		appearance: none;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		outline: none;
		background-color: transparent;
		cursor: pointer;
		margin: 0;
	}

	.checkbox:hover > input {
		color: var(--tertiary-color);
		border-color: var(--tertiary-color);
	}

	.checkbox > span + input:checked::before {
		content: '\2713';
		display: block;
		text-align: center;
		position: absolute;
		right: -2px;
		bottom: 0.45em;
		font-size: 1.4em;
		font-weight: 700;
	}
</style>
