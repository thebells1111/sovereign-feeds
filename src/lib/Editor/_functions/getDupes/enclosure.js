export default function enclosureDupes(list) {
	let dupeIndexes = [];
	const lookup = list.reduce((a, v) => {
		a[v.enclosure['@_url']] = ++a[v.enclosure['@_url']] || 0;
		return a;
	}, {});

	let dupes = list.filter((v, i) => {
		if (lookup[v.enclosure['@_url']]) {
			dupeIndexes.push(i);
			return true;
		}
	});
	return { dupeArray: dupes, dupeIndexes: dupeIndexes };
}
