<script>
	import initializePersonTag from '$lib/Editor/_functions/initializePersonTag';
	import initializeValueTag from '$lib/Editor/_functions/initializeValueTag';
	import initializeSocialInteractTag from '$lib/Editor/_functions/initialize/socialInteract';
	import initializeEpisodeGuid from '$lib/Editor/_functions/initialize/episodeGuid';
	import blankLiveEpisode from '$lib/Editor/_functions/blanks/liveItem';
	import blankTranscript from '$lib/Editor/_functions/blanks/transcript';

	import clone from 'just-clone';

	import { showCreateEpisode } from '$/stores';

	import {
		episodesList,
		editingEpisode,
		showLiveEpisodes,
		regularEpisodes,
		liveEpisodes,
		newEditorScreen,
		showNewEditor,
		duplicateEditorScreen,
		newEpisodeHeaders,
		rssData
	} from '$/editor';

	function createEpisode(type) {
		let newEpisode = {
			title: 'New Episode',
			author: null,
			description: '',
			duration: null,
			enclosure: { '@_length': null, '@_type': null, '@_url': null },
			guid: { '#text': null, '@_isPermaLink': 'false' },
			'itunes:image': { '@_href': null },
			'itunes:keywords': null,
			'itunes:subtitle': null,
			'itunes:summary': null,
			link: null,
			'podcast:chapters': { '@_url': null },
			'podcast:person': [
				{
					'#text': '',
					'@_href': '',
					'@_img': '',
					'@_group': 'cast',
					'@_role': 'host'
				}
			],
			'podcast:value': {
				'@_type': 'lightning',
				'@_method': 'keysend',
				'@_suggested': '0.00000005000',
				'podcast:valueRecipient': [
					{
						'@_name': '',
						'@_type': 'node',
						'@_address': '',
						'@_customKey': '',
						'@_customValue': '',
						'@_split': '',
						'@_fee': ''
					}
				]
			},
			'podcast:license': { '@_url': '', '#text': '' }
		};

		let newEp;

		if (type === 'copy') {
			newEp = clone($episodesList[0]);
			newEp.title = newEp.title + ' - Copy';
			newEp['itunes:subtitle'] = newEp.title;
			// newEp.enclosure = { '@_length': null, '@_type': null, '@_url': null };
			newEp.pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';
			newEp['podcast:person'] = initializePersonTag(newEp['podcast:person']);
			newEp['podcast:value'] = initializeValueTag(newEp['podcast:value']);
			newEp['podcast:socialInteract'] = initializeSocialInteractTag(
				newEp['podcast:socialInteract']
			);
			newEp['podcast:chapters'] = newEp['podcast:chapters'] || { '@_url': null };
			let t = [].concat(newEp['podcast:transcript']).slice(0, 1);
			newEp['podcast:transcript'] = t.length ? t : clone([blankTranscript]);

			// newEp.guid['#text'] = '';
			// newEp.link = '';
			newEp.guid = initializeEpisodeGuid(newEp);

			newEp['podcast:chapters'] = newEp['podcast:chapters'] || { '@_url': null };
			newEp['itunes:duration'] = 0;
			delete newEp['podcast:value']['podcast:valueTimeSplit'];
			delete newEp.valueTimeSplit;
		} else if ($showLiveEpisodes) {
			newEp = clone(blankLiveEpisode);
		} else {
			newEp = newEpisode;
		}

		let descendingTypes = ['audiobook', 'music'];

		$episodesList = descendingTypes.includes($rssData?.['podcast:medium'])
			? [...$episodesList, newEp]
			: [newEp, ...$episodesList];
		if ($showLiveEpisodes) {
			$liveEpisodes = $episodesList;
			$rssData['podcast:liveItem'] = $episodesList;
		} else {
			$regularEpisodes = $episodesList;
			$rssData.item = $episodesList;
		}
		$editingEpisode = descendingTypes.includes($rssData?.['podcast:medium'])
			? $episodesList[$episodesList.length - 1]
			: $episodesList[0];

		if (type === 'clean' || $showLiveEpisodes) {
			$showNewEditor = true;
			$newEditorScreen = 'duplicateEpisode';
			$duplicateEditorScreen = 'episodeMeta';
		} else if ((type = 'copy')) {
			$showNewEditor = true;
			$newEditorScreen = 'duplicateEpisode';
			$duplicateEditorScreen = 'episodeMeta';
		}
	}
</script>

<div class="episode-create-modal" on:click={() => ($showCreateEpisode = false)}>
	<div class="button-container">
		<button on:click={createEpisode.bind(this, 'clean')} class="primary blank">
			{$newEpisodeHeaders.blank}
		</button>
		<button on:click={createEpisode.bind(this, 'copy')} class="primary">
			{$newEpisodeHeaders.copy}</button
		>
	</div>
</div>

<style>
	.button-container {
		width: 600px;
		height: 300px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
	}

	button.primary {
		width: 200px;
	}

	button.blank {
		background-image: linear-gradient(to bottom, hsl(191, 82%, 50%), hsl(191, 82%, 30%));
	}

	.episode-create-modal {
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 33;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
