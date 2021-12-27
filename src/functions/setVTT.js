import { playingEpisode, player, trackSrc } from '$/stores';
import { get } from 'svelte/store';

import srt2webvtt from '$functions/srt2webvtt';

export default async function setVTT() {
	const transcriptVTT = get(playingEpisode).transcript?.find(({ type }) => type.includes('vtt'));
	const transcriptSRT = get(playingEpisode).transcript?.find(({ type }) => type.includes('srt'));

	if (transcriptVTT?.url) {
		get(player).addRemoteTextTrack({ src: transcriptVTT.url, label: 'Caption' }, false);
	} else if (transcriptSRT?.url) {
		console.log(transcriptSRT.url);
		let res = await fetch(`/api/httpsproxy?url=` + transcriptSRT.url);

		if (res.status === 200) {
			let text = await res.text();

			let vtt = srt2webvtt(text);
			let url = new Blob([vtt], { type: 'text/vtt' });
			trackSrc.set(URL.createObjectURL(url));
			get(player).addRemoteTextTrack({ src: get(trackSrc), label: 'Caption' }, false);
		}
	}
}
