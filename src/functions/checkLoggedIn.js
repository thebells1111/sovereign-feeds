import { userState, loggedIn } from '$/stores';

export default async function checkLoggedIn() {
	console.log('check');
	let data = {
		type: 'loader'
	};
	try {
		fetch(`/api/database`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		}).then((response) =>
			response.json().then((data) => {
				if (data.status === 'success') {
					loggedIn.set(true);
				} else {
					let options = {
						type: 'reset'
					};
				}
			})
		);
	} catch {
		(error) => {
			console.error('Error:', error);
		};
	}
}
