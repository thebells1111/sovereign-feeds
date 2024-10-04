export default function initializeLiveItemTime(episode) {
	if (episode['@_start'].dateTime) {
		return episode['@_start'];
	}
	const d = new Date(episode['@_start']);
	let duration = { hour: 1, minute: '30' };

	if (episode['@_end']) {
		const e = new Date(episode['@_end']);
		const delta = (e.getTime() - d.getTime()) / 1000;
		const hr = Math.floor(delta / 3600);
		const min = padZero(Math.floor((delta - hr * 3600) / 60));

		duration.hour = hr;
		duration.minute = min;
	}

	let hour = d.getHours();
	const minute = d.getMinutes();
	const meridian = hour < 12 ? false : true;

	if (hour > 12) {
		hour -= 12;
	} else if (hour === 0) {
		hour = 12;
	}

	let v = {};
	v.dateTime = d;
	v.hour = hour;
	v.minute = padZero(minute);
	v.meridian = meridian;
	v.duration = duration;
	return v;
}

function padZero(num) {
	num = Number(num);
	if (num < 10) {
		return '0' + num;
	}
	return num;
}
