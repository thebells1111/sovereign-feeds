import { loggedIn, serverUrl } from '$/stores';
import { remoteServerUrl } from '$/editor';

//this is to get the senderID and store it as a cookie
export default async function checkUser() {
	try {
		let response = await fetch(remoteServerUrl + `/api/sf/verify-token`, {
			credentials: 'include'
		});

		if (response.status === 200) {
			let data = await response.json();
			console.log(data);
			if (data.status === 'success') {
				loggedIn.set(true);
			}
			return data.user;
		} else {
			return {};
		}
	} catch (err) {
		console.log(err);
	}
}
