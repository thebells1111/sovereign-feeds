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

	<p>
		After you've clicked link, you'll be taken to a sign up page. Choose your preferred sign up
		method.
	</p>

	<img src="/images/tutorials/setup-digital-ocean/1.png" />

	<p>Then Confirm you email address</p>
	<img src="/images/tutorials/setup-digital-ocean/2.png" />
	<p>then add a payment method.</p>
	<img src="/images/tutorials/setup-digital-ocean/3.png" />

	<p>Once you're setup, click on Explore our control panel</p>

	<img src="/images/tutorials/setup-digital-ocean/4.png" />
	<p>Then click on Spaces in the left hand menu</p>

	<img src="/images/tutorials/setup-digital-ocean/5.png" />

	<p>Click the Create a Space button</p>

	<img src="/images/tutorials/setup-digital-ocean/6.png" />

	<p>Choose a Data Center closests to to you.</p>
	<p>
		Although not strictly necessary, having a CDN will save you money and make delivering your feed
		faster.
	</p>
	<p>
		Click the Enable CDN Button and set the Edge Cache TTL to 1 day or 1 week depending on the
		frequency of your feed.
	</p>
	<p>Keep the Restrict File Listing button clicked.</p>
	<img src="/images/tutorials/setup-digital-ocean/16.png" />

	<p>Finally, pick a unique name for your space.</p>
	<p>
		Once everything is complete, the Create a Space button will turn green. Go ahead and click that
		button.
	</p>
	<img src="/images/tutorials/setup-digital-ocean/17.png" />

	<p>
		In a new tab, open up Sovereign Feeds, make sure you're signed in, click your feed, then click
		on Web Hooks
	</p>

	<img src="/images/tutorials/setup-digital-ocean/10.png" />

	<p>
		Click on Digital Ocean to expand it. Click on Enable Digital Ocean, then add your Bucket Name
		and Endpoint
	</p>
	<img src="/images/tutorials/setup-digital-ocean/11.png" />
	<p>Your Bucket is found on the Spaces drag and drop screen.</p>
	<p>Hover over Endpoints to get your end point.</p>
	<p>
		Copy the URL, and remove the https://bucket-name from that link, then paste it into Sovereign
		Feeds
	</p>

	<img src="/images/tutorials/setup-digital-ocean/9.png" />

	<p>Back in Digital Ocean, click the API link in the left hand menu.</p>

	<img src="/images/tutorials/setup-digital-ocean/7.png" />

	<p>Click on the Generate New Key Button</p>

	<img src="/images/tutorials/setup-digital-ocean/8.png" />

	<p>Pick a name, then click the blue checkmark.</p>

	<img src="/images/tutorials/setup-digital-ocean/12.png" />

	<p>
		This is the only time you'll see the secret. If you mess up and don't save the secret properly,
		just Generate a New Key.
	</p>

	<img src="/images/tutorials/setup-digital-ocean/13.png" />

	<p>
		Copy the Access Key and the Secret Key, and paste them into Sovereign Feeds, then press Save.
	</p>

	<img src="/images/tutorials/setup-digital-ocean/14.png" />

	<p>
		Now click on Episode Info in the left hand menu. If you see an Upload button next to Episode
		Art, you're all set.
	</p>
	<p>
		Click the Upload button and you should be able to upload your files direct to your Digital Ocean
		Spaces.
	</p>

	<img src="/images/tutorials/setup-digital-ocean/15.png" />
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
