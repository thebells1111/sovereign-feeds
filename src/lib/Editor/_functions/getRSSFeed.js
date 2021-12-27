import {} from '$/stores';
export default async function getRSSEditorFeed(url) {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/api/rsscreator?url=${encodeURIComponent(url)}`);
		const feed = await res.json();

		resolve(feed);
	});
}
