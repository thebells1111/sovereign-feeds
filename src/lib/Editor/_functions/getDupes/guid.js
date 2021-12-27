export default function guidDupes(list) {
	let dupeIndexes = [];
	const lookup = list.reduce((a, v) => {
		a[v.guid['#text']] = ++a[v.guid['#text']] || 0;
		return a;
	}, {});

	let dupes = list.filter((v, i) => {
		if (lookup[v.guid['#text']]) {
			dupeIndexes.push(i);
			return true;
		}
	});
	return { dupeArray: dupes, dupeIndexes: dupeIndexes };
}
