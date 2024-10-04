export default function initializeCategories(data) {
	let categoriesArray = [];

	if (Array.isArray(data)) {
		categoriesArray = data.map((item) => {
			return typeof item === 'string' ? { '@_text': item } : item;
		});
	} else if (typeof data === 'string') {
		categoriesArray.push({ '@_text': data });
	} else if (data && typeof data === 'object') {
		categoriesArray.push(data);
	} else {
		categoriesArray.push({ '@_text': '' });
	}

	return categoriesArray;
}
