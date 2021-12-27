<script>
	import {
		selectedPodcast,
		currentPage,
		editorDB,
		podcastList,
		showSaved,
		rssData
	} from '$/editor';
</script>

<div class="podcast-list">
	<img
		src={$rssData?.['itunes:image']?.['@_href'] || './SF192.png'}
		style={`height: 100x; width: 100px; margin: 0 auto`}
	/>
	<h3>{$selectedPodcast.title || 'Sovereign Feeds'}</h3>
	<ul>
		<li
			class:active={$currentPage === 'feeds'}
			on:click={() => {
				$currentPage = 'feeds';
			}}
		>
			<span>Favorite Feeds</span>
		</li>
		{#if $selectedPodcast.title}
			<li
				class:active={$currentPage === 'episodes'}
				on:click={() => {
					$currentPage = 'episodes';
				}}
			>
				<span>Episodes</span>
			</li>
			<li
				class:active={$currentPage === 'podcastMetadata'}
				on:click={() => {
					$currentPage = 'podcastMetadata';
				}}
			>
				<span>Show Info</span>
			</li>
			<li
				class:active={$currentPage === 'editor'}
				on:click={() => {
					$currentPage = 'editor';
				}}
			>
				<span>Episode Info</span>
			</li>

			<li
				class:active={$currentPage === 'publish'}
				class="publish"
				on:click={() => {
					$currentPage = 'publish';
					editorDB.setItem('favorites', $podcastList);
				}}
			>
				<span>Publish Feed</span>
			</li>
			<li
				class:active={$currentPage === 'podping'}
				class="podping"
				on:click={() => {
					$currentPage = 'podping';
				}}
			>
				<span>Podping</span>
			</li>
			<li
				class:active={$currentPage === 'webhooks'}
				class="webhooks"
				on:click={() => {
					$currentPage = 'webhooks';
				}}
			>
				<span>Web Hooks</span>
			</li>
		{/if}
	</ul>
	{#if !$selectedPodcast.title}
		<div class="support">
			<p>How much do you value being Sovereign?</p>
			<img src="./LNURL.png" />
			<p>⚡Value 4 Value⚡</p>
		</div>
	{/if}
	{#if $selectedPodcast.title}
		<button
			class="primary save-state"
			on:click={() => {
				editorDB.setItem('favorites', $podcastList);
				$showSaved = true;
			}}
		>
			Save
		</button>
	{/if}
</div>

<style>
	.podcast-list {
		height: 100%;
		overflow: hidden;
		padding: 0;
		display: flex;
		flex-direction: column;
		padding-bottom: 8px;
	}

	ul {
		height: calc(100% - 36px);
	}
	h3 {
		margin: 0;
		text-align: center;
	}

	li {
		padding: 8px;
		cursor: pointer;
		font-size: 1.1em;
		font-weight: 550;
		user-select: none;
	}

	li > span {
		padding: 2px;
	}

	button.primary {
		align-self: center;
		min-height: 32px;
	}

	.active {
		color: rgb(27, 111, 246);
		font-weight: 700;
	}

	.active > span {
		border-bottom: 2px solid rgb(27, 111, 246);
	}

	.support {
		position: relative;
	}

	.support p {
		margin: 0;
		padding: 0;
		text-align: center;
		font-weight: 600;
	}
	.support p:nth-of-type(1) {
		position: relative;
		top: 8px;
	}

	.support p:nth-of-type(2) {
		position: relative;
		bottom: 16px;
	}
</style>
