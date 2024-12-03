<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';
	import {
		selectedPodcast,
		currentPage,
		editorDB,
		podcastList,
		showSaved,
		rssData,
		feedText,
		xmlJson,
		editingEpisode,
		leftPaneSelector
	} from '$/editor';

	import buildRSS from '../Publish/buildrss';
	import initializeRSSData from '$lib/Editor/_functions/initializeRSSData';

	async function saveManualChanges() {
		const parserOptions = {
			attributeNamePrefix: '@_',
			//attrNodeName: false,
			//textNodeName : "#text",
			ignoreAttributes: false,
			ignoreNameSpace: false,
			attrValueProcessor: (val, attrName) => decode(val), //default is a=>a
			tagValueProcessor: (val, tagName) => decode(val) //default is a=>a
		};

		let xml2Json = parse($feedText, parserOptions);

		$xmlJson = xml2Json;

		$selectedPodcast.xml = $xmlJson;
		$selectedPodcast.rss = $xmlJson.rss.channel;
		// $rssData = $xmlJson.rss.channel;
		await initializeRSSData($selectedPodcast.rss);

		/* add error handling */
	}
</script>

<div class="podcast-list">
	<img
		src={$rssData?.['itunes:image']?.['@_href'] || './SF192.png'}
		style={`height: 100x; width: 100px; margin: 0 auto`}
	/>
	<h3>{$rssData?.title || 'Sovereign Feeds'}</h3>
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
			{#if ['publisher', 'musicL'].find((v) => v === $rssData?.['podcast:medium'])}
				<li
					class:active={$currentPage === 'publisherRemoteItems'}
					on:click={() => {
						$currentPage = 'publisherRemoteItems';
					}}
				>
					<span>{$leftPaneSelector.items}</span>
				</li>
			{:else}
				<li
					class:active={$currentPage === 'episodes'}
					on:click={() => {
						$currentPage = 'episodes';
					}}
				>
					<span>{$leftPaneSelector.items}</span>
				</li>
			{/if}
			<li
				class:active={$currentPage === 'podcastMetadata'}
				on:click={() => {
					$currentPage = 'podcastMetadata';
				}}
			>
				<span>
					{$leftPaneSelector.channelInfo}
				</span>
			</li>
			<li
				class:active={$currentPage === 'editor'}
				on:click={() => {
					if (!['publisher', 'musicL'].find((v) => v === $rssData?.['podcast:medium'])) {
						$currentPage = 'editor';
					}
				}}
			>
				<span>
					{$leftPaneSelector.itemInfo}
				</span>
			</li>
			<li
				class:active={$currentPage === 'manual'}
				class="edit"
				on:click={() => {
					$currentPage = 'manual';
					buildRSS().then(({ title, xmlFile }) => {
						if (!xmlFile) {
							return;
						}
						$feedText = xmlFile;
					});
				}}
			>
				<span>Manually Edit Feed</span>
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
		<li
			class:active={$currentPage === 'updateValueBlock'}
			class="webhooks"
			on:click={() => {
				$currentPage = 'updateValueBlock';
			}}
		>
			<span>Value Block Updater</span>
		</li>
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
			on:click={async () => {
				if ($currentPage === 'manual') {
					await saveManualChanges();
				}

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
