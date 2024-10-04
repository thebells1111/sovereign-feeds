export default function cleanChat(data) {
	if (data['podcast:chat']) {
		if (!data['podcast:chat']['@_server']) {
			delete data['podcast:chat'];
		} else if (!data['podcast:chat']['@_protocol']) {
			delete data['podcast:chat']['@_protocol'];
		} else {
			if (!data['podcast:chat']['@_accountId']) {
				delete data['podcast:chat']['@_accountId'];
			}
			if (!data['podcast:chat']['@_space']) {
				delete data['podcast:chat']['@_space'];
			}
			if (!data['podcast:chat']['@_embedUrl']) {
				delete data['podcast:chat']['@_embedUrl'];
			}
		}
	}
}
