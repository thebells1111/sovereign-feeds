<div class="explainer">
	<h2>
		This feature is still Beta. If you choose to use it, thanks for being an early adopter, and
		please let me know any issues you may have.
	</h2>
	<p>
		By providing a Webhook Link and Secret, you can develop an API on your self-hosted server that
		can receive the XML file Sovereign Feeds generates. This will allow you to upload your RSS feed
		directly from Sovereign Feeds to your server.
	</p>

	<p class="reduced-padding">
		The Webhook Link is a link to your server that will handle receiving a POST of the XML file.
	</p>
	<p class="indent">
		For example, <span class="example">{`https:yourserver.com/api/rssgenerator`}</span>
	</p>

	<p class="reduced-padding">
		The Webhook Secret is a an authorization token that will be included in the request header when
		sending the XML file to your server. This allows you to block any request that doesn't include
		the token and allow any request that does include the token.
	</p>
	<p class="indent">
		<span class="example">{`authorization: 'Bearer <webhook Secret>'`}</span>
		will be included in each request header from Sovereign Feeds if you include a Webhook Secret.
	</p>

	<p>
		It is highly recommended your server is a HTTPS server to ensure your Webhook Secret is
		encrypted when sending requests to your server.
	</p>
	<p>
		The idea behind this is you can use Sovereign Feeds to create your RSS feed, then publish the
		RSS feed to your server without having to download the XML file, followed by uploading the file
		to your server. You can write a server function to update the existing RSS feed with the new RSS
		feed sent to your server, as well as creating an archive of the RSS feed for backup.
	</p>
	<p>
		With the Webhook Secret, the idea is anyone who has the secret has permission to edit the RSS
		file on your server. This has the potential for someone to hijack your RSS feed, so be careful
		with who you share the secret with.
	</p>
</div>

<style>
	.explainer {
		padding: 8px 16px 8px 0;
	}
	p {
		font-weight: 550;
	}

	.reduced-padding {
		padding-bottom: 4px;
	}

	.indent {
		padding: 0 0 16px 32px;
	}

	.example {
		color: hsla(352, 100%, 43.7%, 1);
	}
</style>
