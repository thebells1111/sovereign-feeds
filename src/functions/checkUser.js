import { loggedIn, serverUrl } from '$/stores';

//this is to get the senderID and store it as a cookie
export default async function checkUser() {
	try {
		let response = await fetch(serverUrl + `database/checkuser?app=sf&&${new Date().getTime()}`, {
			credentials: 'include'
		});
		console.log(response);
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
