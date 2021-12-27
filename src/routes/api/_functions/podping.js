import run from '@googleapis/run';
import dotenv from 'dotenv';
dotenv.config();

function podping(feedUrl, reason = 'update', medium = 'podcast') {
	return new Promise((resolve, reject) => {
		if (feedUrl) {
			const {
				SERVICE_ACCOUNT,
				AUTH_KEY,
				PROJECT_ID,
				REGION,
				SERVICE_NAME,
				CONTAINER_IMAGE,
				PODPING_HIVE_ACCOUNT
			} = process.env;

			// console.log(' ');
			// console.log(' ');

			// console.log('____________________________');
			// console.log(SERVICE_ACCOUNT);

			const AuthKey = JSON.parse(AUTH_KEY);
			const PODPING_MEDIUM = medium || 'podcast';
			const PODPING_REASON = reason;
			const PODPING_HIVE_POSTING_KEY_SECRET_NAME = 'hive-posting-key';
			const PODPING_LIVETEST = 'false';
			const feeds = [feedUrl];
			runPodpingHivewriterContainer(
				AuthKey,
				SERVICE_ACCOUNT,
				PROJECT_ID,
				REGION,
				SERVICE_NAME,
				CONTAINER_IMAGE,
				PODPING_HIVE_ACCOUNT,
				PODPING_HIVE_POSTING_KEY_SECRET_NAME,
				PODPING_MEDIUM,
				PODPING_REASON,
				PODPING_LIVETEST,
				feeds
			);
			async function runPodpingHivewriterContainer(
				authKey,
				serviceAccount,
				projectId,
				region,
				serviceName,
				containerImage,
				hiveAccount,
				hivePostingKeySecretName,
				medium,
				reason,
				testMode,
				feeds
			) {
				const auth = new run.auth.GoogleAuth({
					credentials: authKey,
					scopes: ['https://www.googleapis.com/auth/cloud-platform']
				});

				const authClient = await auth.getClient();
				const runClient = run.run({
					version: 'v1',
					auth: authClient
				});
				const requestBody = {
					apiVersion: 'serving.knative.dev/v1',
					kind: 'Service',
					metadata: {
						name: serviceName
					},
					spec: {
						template: {
							spec: {
								serviceAccountName: serviceAccount,
								containers: [
									{
										image: containerImage,
										resources: { limits: { memory: '256Mi' }, requests: { memory: '150Mi' } },
										env: [
											{
												name: 'PODPING_LIVETEST',
												value: testMode
											},
											{
												name: 'PODPING_HIVE_ACCOUNT',
												value: hiveAccount
											},
											{
												name: 'PODPING_IGNORE_CONFIG_UPDATES',
												value: 'true'
											},
											{
												name: 'PODPING_SANITY_CHECK',
												value: 'false'
											},
											{
												name: 'PODPING_MEDIUM',
												value: medium
											},
											{
												name: 'PODPING_REASON',
												value: reason
											},
											{
												name: 'PODPING_HIVE_POSTING_KEY',
												valueFrom: {
													secretKeyRef: { name: hivePostingKeySecretName, key: 'latest' }
												}
											}
										],
										args: ['write', ...feeds]
									}
								]
							}
						}
					}
				};
				try {
					const createResponse = await runClient.projects.locations.services.create({
						parent: `projects/${projectId}/locations/${region}`,
						requestBody
					});
					console.log(createResponse);
					if (reason) {
						resolve(reason[0].toUpperCase() + reason.substring(1) + ' PodPing Sent');
					} else {
						resolve('Update PodPing Sent');
					}

					// console.log(createResponse);
				} catch (e) {
					// console.clear();
					// console.log(e.code);
					if (e.code === 409) {
						const replaceResponse = await runClient.projects.locations.services.replaceService({
							name: `projects/${projectId}/locations/${region}/services/${serviceName}`,
							requestBody
						});
						console.log(replaceResponse);
						if (reason) {
							resolve(reason[0].toUpperCase() + reason.substring(1) + ' PodPing Sent');
						} else {
							resolve('Update PodPing Sent');
						}
					}
					resolve('PodPing Error');
				}
			}
		} else {
			resolve('No Feed Url');
		}
	});
}

export default podping;
