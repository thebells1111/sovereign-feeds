import { loggedIn, serverUrl } from '$/stores';

//this is to get the senderID and store it as a cookie
export default async function checkUser() {
	try {
		let response = await fetch(serverUrl + `verify-token`, {
			credentials: 'include'
		});
		let res = await fetch(`https://curiohoster.com/api/verify-token`, {
			credentials: 'include'
		});
		let d = await res.json();
		console.log(d);
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
