<script>
	import { playerTime, isPlayerLoaded } from '$/stores';

	function convertTime(time) {
		let formatTime = new Date(time * 1000).toISOString().substr(11, 8);
		if (formatTime.charAt(0) === '0') {
			return formatTime.substring(1);
		}

		return formatTime;
	}
</script>

<div>{$playerTime ? convertTime($playerTime) : ''}</div>
