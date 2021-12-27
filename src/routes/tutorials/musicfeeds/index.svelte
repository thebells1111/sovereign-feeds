<article>
	<h1>How To Setup a Music Feed Using a Free Dropbox Account</h1>
	<p>
		We're assuming you already have a free personnel Dropbox account setup. If not, head over to <a
			href="https://www.dropbox.com/referrals/AABzF0_Y7mIIAZeOW8OeVPKW8nTvC_qIZ68?src=global9"
			>Dropbox</a
		> and signup for a free account.
	</p>

	<img src="/images/tutorials/musicfeeds/dropbox-sign-in.png" style="width:50%" />

	<p>
		Dropbox is kind tricky, so if you do sign up for the free account, pay attention and click the
		small link at the bottom.
	</p>

	<div class="step" />
	<p>
		Once you have your Dropbox account set up, Click the Create button, title it the name of your
		album, keep the access as Only you, then hit the Blue Create button.
	</p>
	<img src="/images/tutorials/musicfeeds/1.png" style="margin-bottom: 32px" />
	<img src="/images/tutorials/musicfeeds/2.png" />

	<p>
		After you've created your album folder, open the folder and create a song folder for each of
		your songs
	</p>

	<div class="step" />

	<p>
		Once you have a song folder for each of your songs, grab your mp3 file and the album art file
		for each song and drop it into it's appropriate song folder.
	</p>
	<img src="/images/tutorials/musicfeeds/3.png" />
	<p>
		Now that you have each song set up, upload your album art to the album folder, and you're ready
		to start creating your RSS feed.
	</p>

	<div class="step" />

	<p>
		Open up <a href="https://sovereignfeeds.com/" target="_blank" rel="noopener noreferrer"
			>Sovereign Feeds</a
		> in a new tab so you can work on your feed while following this tutorial.
	</p>

	<p>Click on the Create New Feed button in the lower left hand corner.</p>
	<img src="/images/tutorials/musicfeeds/4.png" />

	<p>Next click on Music Album to create a Music Feed</p>
	<img src="/images/tutorials/musicfeeds/5.png" />

	<div class="step" />

	<p>
		Fill out the <span class="red">Band Name, Album Name, Album Description</span> (this is
		optional, but should be a short sentence if used), and select Music for the
		<span class="red">Category</span>.
	</p>

	<div class="step" />

	<p>
		For the Album Art, go to Dropbox in a differnt tab, open your Album folder, and hover your
		cursor over the <span class="bold">Only you</span> text of your album art. Click Copy Link.
	</p>
	<img src="/images/tutorials/musicfeeds/6.png" />

	<p>
		Now go back to the Sovereign Feeds tab, and paste the copied link into <span class="red"
			>Album Art</span
		>. Notice how the link has <span class="bold">?dl=0</span> at the end?
	</p>
	<img src="/images/tutorials/musicfeeds/7.png" />
	<p>
		We're going to change that to <span class="bold">?raw=1</span>. Once that's done, you should see
		your art work pop up in the image box.
	</p>
	<img src="/images/tutorials/musicfeeds/8.png" />
	<p>
		This will have to be done with every Dropbox link, since what we want is the raw file, not a the
		downloadable file. That's about the only quirk to using Dropbox as our hosting solution.
	</p>

	<div class="step" />

	<p>The album is now set up, so click the <span class="bold">Create First Song</span> button.</p>
	<img src="/images/tutorials/musicfeeds/9.png" />

	<div class="step" />

	<p>
		Back in Dropbox tab, go to the folder for your first song. Just like you did for the album art,
		hover your cursor over the <span class="bold">Only you</span> text of your song mp3 file and
		copy the link. Switch to your Sovereign Feeds tab and paste that link into
		<span class="bold red">Link to Song File</span>. Change the <span class="bold">?dl=0</span> to
		<span class="bold">?raw=1</span>.
	</p>

	<p>
		Go back to the Dropbox hover your cursor over the <span class="bold">Only you</span> text of
		your song artwork file and copy the link. Switch back to your Sovereign Feeds tab and paste that
		link into <span class="bold red">Link to Song Art</span>. Change the
		<span class="bold">?dl=0</span>
		to <span class="bold">?raw=1</span>.
	</p>

	<div class="step" />

	<p>
		Now we can fill in the rest of the song data, so add the <span class="red">Name of Song</span>
	</p>
	<p>
		For <span class="red">Song GUID</span> pick a unique identifier for this song. It can be
		something like <span class="bold">Song 1</span>, <span class="bold">The Name of the Song</span>,
		or <span class="bold">The Link to Song File</span> (if you use the link to the song file as your
		GUID, go ahead and change <span class="red">isPermalink</span> to <span class="bold">Yes</span>)
	</p>

	<p>
		If you have a webpage with the song on it, you can add the link to that page to <span
			class="red">Link to Page with Song</span
		>, otherwise leave it blank
	</p>

	<p>
		Don't worry about the <span class="bold">Sync Show Art</span> button, that is used primarily by podcaster
		to update their show art to match their latest episode art, but shouldn't apply to you.
	</p>
	<p>
		Click the <span class="bold">Set Pub Date</span> button to set the Pub Date to the current time.
	</p>

	<p>
		If your song has explicit content, click <span class="bold">Yes</span> on
		<span class="red">Explicit Content</span>, otherwise click <span class="bold">No</span>
	</p>
	<p>
		Enter your <span class="red">Band Name</span>, and for search engines, pick a few
		<span class="red">Keywords</span> to describe your song.
	</p>

	<p>
		Your song's info is finished, so click on the <span class="bold">Liner Notes</span> button to continue
	</p>
	<img src="/images/tutorials/musicfeeds/10.png" />

	<p>
		Here you can put your lyrics, your acknowledgements, credits, etc, just like you would in liner
		notes for an album. Once you're done, click the <span class="bold"
			>Song Art, Lyrics, and Comments</span
		> button.
	</p>
	<img src="/images/tutorials/musicfeeds/11.png" />

	<div class="step" />

	<p>
		This is more advanced stuff we're going to cover in future tutorials, so for now, click <span
			class="bold">Value Tags</span
		> button.
	</p>
	<img src="/images/tutorials/musicfeeds/12.png" />

	<div class="step" />

	<p>
		Again more stuff we're going to cover in future tutorials, but this is one you're going to want
		to come back to, because it's how you get paid. For now though, click the <span class="bold"
			>Band and Crew</span
		> button.
	</p>
	<img src="/images/tutorials/musicfeeds/13.png" />

	<div class="step" />

	<p>
		Now YOU can enter the Band and Crew. You can enter the name of the <span class="red"
			>Person</span
		>, pick the the <span class="red">Group</span> their role falls under, pick their
		<span class="red">Role</span>, provide a <span class="red">Image Link</span> to a picture of the
		person (if it's in your Dropbox, don't forget to change <span class="bold">?dl=0</span> to
		<span class="bold">?raw=1</span>) and a link to the <span class="red">Website</span> of the person.
	</p>

	<p>
		If the <span class="red">Group</span> or <span class="red">Role</span> of the person doesn't
		match what you need, type in your own value, and press <span class="bold">Enter</span>
	</p>
	<p>If you want to add more People to the list, just hit the big Plus Sign.</p>
	<p>
		After you're done, press the big green <span class="bold">Wrap up this Song</span> button.
	</p>
	<img src="/images/tutorials/musicfeeds/14.png" />

	<div class="step" />

	<p>
		To add a New Song, click the <span class="bold">New Song</span> button.
	</p>
	<img src="/images/tutorials/musicfeeds/15.png" />

	<p>
		Then click the <span class="bold">Copy Previous Song</span> button.
	</p>
	<img src="/images/tutorials/musicfeeds/16.png" />

	<p>
		What you'll notice is we're back on the <span class="bold">Create a Song Editor</span> but we have
		all of the same info as the previous song. This conveniently copies tags that are constant for each
		song. However, it does copy the tags we are are unique to each song. It's easy enough to change the
		unique tags that this results in less work being done for each song.
	</p>
	<p>
		These steps are just repeating what we did for the first song, but changing each value to match
		the song it's associated with. You'll repeat this for every song in your album.
	</p>

	<div class="step" />

	<p style="font-size: 1.5em">
		At any point you can save your progress by clicking the <span class="bold">Save</span> button or
		pressing <kbd>CTRL</kbd> + <kbd>S</kbd>
	</p>
	<img src="/images/tutorials/musicfeeds/17.png" />

	<div class="step" />

	<p>
		After you've added all of your songs, click on the <span class="bold">Create RSS File</span>
	</p>
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

	.step {
		border-bottom: 1px solid gray;
		width: 90%;
		margin: 16px 0;
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
