export default function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = () => {
			resolve();
		};
		script.onerror = () => {
			console.log('Failed to load script', src);
			reject();
		};
		script.src = src;
		document.head.appendChild(script);
	});
}
