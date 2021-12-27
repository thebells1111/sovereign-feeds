export default function initializeCategories(data) {
	let categoriesArray = data
		? [].concat(data)
		: [
				{
					'#text': ''
				}
		  ];

	return categoriesArray;
}
