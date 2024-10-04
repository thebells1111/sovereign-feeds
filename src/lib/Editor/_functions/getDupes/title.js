function titleDupes(list) {
	let dupeIndexes = [];
	const lookup = list.reduce((a, v) => {
		a[v.title] = ++a[v.title] || 0;
		return a;
	}, {});

	let dupes = list.filter((v, i) => {
		if (lookup[v.title]) {
			dupeIndexes.push(i);
			return true;
		}
	});
	return { dupeArray: dupes, dupeIndexes: dupeIndexes };
}
