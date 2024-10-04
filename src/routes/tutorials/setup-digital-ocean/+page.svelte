<article>
	<h1>How to Setup Digital Ocean to Host Your Feed</h1>

	<a
		class="referral-link"
		href="https://www.digitalocean.com/?refcode=a31fcef64f4f&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"
		>Use this link to support Sovereign Feeds and setup your Digital Ocean Account</a
	>

	<p>
		Using this link will give you two months of free hosting. If you decide you don't want to
		continue, you can cancel your Digital Ocean account without being charged. After you've spent
		$25, Digital Ocean will send $25 to Sovereign Feeds, so you'll also be supporting my work.
	</p>

	<iframe
		title="Self Hosting Using Digital Ocean"
		src="https://noagendatube.com/videos/embed/cf9e7dec-1d35-4a4b-a860-0ae5fc9bf153"
		frameborder="0"
		allowfullscreen="true"
		sandbox="allow-same-origin allow-scripts allow-popups"
	/>

	<p style="text-decoration: underline;"><strong>Quick Steps</strong></p>
	<ul>
		<li>Log In</li>
		<li>Create a New Project</li>
		<li>Name your project</li>
		<li>Skip the Description</li>
		<li>Select Other for purpose</li>
		<li>Give a reason.</li>
		<li>Go to Spaces</li>
		<li>Use the default Server</li>
		<li>Enable the CDN</li>
		<li>Give a unique name</li>
		<li>Select your project name</li>
		<li>Click Create a Spaces Bucket</li>
		<li>Click the Settings Tab</li>
		<li>In the CDN, click Change</li>
		<li>Set the Edge Cache to One Week</li>
		<li>Click Save</li>
		<li>In CORS, click ADD</li>
		<li>Type an asterisk(*) in Origin</li>
		<li>Click GET</li>
		<li>Set Access Control Age to 86400</li>
		<li>Save</li>
		<li>Click the Files Tab</li>
		<li>Create new folders if desired</li>
		<li>Drag and drop your non-changing files to the appropriate folders</li>
		<li>Set the file permissions to Public</li>
		<li>Hover over each file to get the link to that file</li>
		<li>If you have changing files, click the green Create button</li>
		<li>Click Spaces</li>
		<li>Do Not Enable the CDN</li>
		<li>Select your project name</li>
		<li>Give this bucket a name and click Create a Space</li>
		<li>Click the Settings Tab</li>
		<li>Add a CORS policy</li>
		<li>Add an asterisk (*) for the ORIGIN</li>
		<li>Click GET</li>
		<li>Set Access Control Age to 86400</li>
		<li>Save</li>
		<li>Click the Files Tab</li>
		<li>Create any folder you want</li>
		<li>Drag and drop your changing files to the appropriate folders</li>
		<li>Set the file permissions to Public</li>
	</ul>
</article>

<style>
	article {
		width: 100%;
		height: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 32px;
	}

	iframe {
		min-width: 56vw;
		min-height: 31.5vw;
		flex-grow: 1;
	}

	h1 {
		text-align: center;
	}

	.step {
		border-bottom: 1px solid gray;
		width: 90%;
		margin: 16px 0;
	}

	.referral-link {
		margin-top: 8px;
		font-size: 1.5em;
		color: rgba(0, 98, 255, 1);
	}

	p {
		width: calc(100% - 32px);
		text-align: center;
		font-size: 1.2em;
		margin: 8px 0;
		padding: 0;
	}

	img {
		max-width: 50%;
		box-shadow: 5px 5px 15px 5px grey;
		border-radius: 8px;
		margin: 8px 0;
	}

	.bold {
		font-weight: bold;
	}

	.red {
		color: hsl(0, 100%, 33%);
		font-weight: 600;
	}

	kbd {
		background-color: #f7f7f7;
		border: 1px solid #ccc;
		border-radius: 3px;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
		color: #333;
		display: inline-block;
		line-height: 1.4;
		margin: 0 0.1em;
		padding: 0.1em 0.6em;
		text-shadow: 0 1px 0 #fff;
	}
</style>
