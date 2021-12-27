export default function loadStyle(src) {
	return new Promise((resolve, reject) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.onload = () => {
			resolve();
		};
		link.onerror = () => {
			console.log('Failed to load CSS', src);
			reject();
		};
		link.href = src;
		document.head.appendChild(link);
	});
}
