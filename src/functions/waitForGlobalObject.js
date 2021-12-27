export default function waitForGlobalObject(objectName, objectNextName) {
	return new Promise((resolve) => {
		function check() {
			if (
				window[objectName] !== undefined &&
				(objectNextName === undefined || window[objectName][objectNextName] !== undefined)
			) {
				resolve();
			} else {
				setTimeout(check, 200);
			}
		}

		check();
	});
}
