export default function cleanPodcastImages(data) {
	data['podcast:aspectImages'] = [].concat(data['podcast:aspectImages']).filter(Boolean); // Convert to array and filter out falsy values
	// Clean each image in the array
	data['podcast:aspectImages'] = data['podcast:aspectImages']
		.filter((image) => image && image['@_src']) // Remove images without '@_src'
		.map((image) => {
			// Process '@_srcset' if it exists and is not a string
			if (image['@_srcset'] && Array.isArray(image['@_srcset'])) {
				if (image['@_srcset'].length > 0) {
					// Convert array to string if it's not empty
					image['@_srcset'] = image['@_srcset']
						.filter((v) => v.url && Number(v.width)) // Filter invalid entries
						.map((v) => `${v.url} ${v.width}w`) // Format entries
						.join(', ');
				} else {
					// Remove '@_srcset' if the array is empty
					delete image['@_srcset'];
				}
			}

			return image; // Return cleaned image
		});

	if (data['podcast:aspectImages'].length === 0) {
		delete data['podcast:aspectImages'];
	}
}
