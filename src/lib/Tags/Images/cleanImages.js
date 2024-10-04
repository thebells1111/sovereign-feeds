export default function cleanPodcastImages(data) {
	// Ensure 'experimental:images' is an array
	data['experimental:images'] = [].concat(data['experimental:images']).filter(Boolean); // Convert to array and filter out falsy values

	// Clean each image in the array
	data['experimental:images'] = data['experimental:images']
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

	// If 'experimental:images' is now an empty array, delete it from data
	if (data['experimental:images'].length === 0) {
		delete data['experimental:images'];
	}
}
