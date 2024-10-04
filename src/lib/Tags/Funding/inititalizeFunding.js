export default function initializeFundingTag(data) {
	if (!data) {
		return [{ '#text': '', '@_url': '' }];
	}
	return Array.isArray(data) ? data : [data];
}
