import convertSrtCue from '$functions/convertSrtCue';

export default function srt2webvtt(data) {
	// remove dos newlines
	var srt = data.replace(/\r+/g, '');
	// trim white space start and end
	srt = srt.replace(/^\s+|\s+$/g, '');
	// get cues
	var cuelist = srt.split('\n\n');
	var result = '';
	if (cuelist.length > 0) {
		result += 'WEBVTT\n\n';
		for (var i = 0; i < cuelist.length; i = i + 1) {
			result += convertSrtCue(cuelist[i]);
		}
	}
	return result;
}
