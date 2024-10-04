<script>
	import Export from '../OPML/Export.svelte';

	import { showDisclaimer, podcastDB, userStateDB, podcastStateDB } from '$/stores';

	let showSpinner = false;

	async function resetApp() {
		try {
			let options = {
				type: 'reset'
			};

			showSpinner = true;
			await userStateDB.clear();
			await podcastStateDB.clear();
			await podcastDB.clear();

			await fetch(`/api/database`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(options)
			});

			window.location.href = '/';
		} catch (err) {
			console.log(err);
		}
	}
</script>

<section class:active={$showDisclaimer} on:click|self={() => ($showDisclaimer = false)}>
	<div class="scroll-bar-clipper">
		<p>
			This app is still in the beta stage of development, and may have changes that will require
			reloading all of your data.
		</p>
		<p>
			Thanks for being patient as I work out all of the issues. And a huge thanks for being an early
			adopter.
		</p>
		<p>
			You can report any issues, ask questions, or make suggestions at podcastindex.social. Please
			make all inquiries to @StevenB
		</p>
		<p>
			You can also contact me on <a href="https://t.me/curiocaster">Telegram</a>
		</p>
		<p>
			You can also email me at <a href="mailto: curiocaster@gmail.com">curiocaster@gmail.com</a>
		</p>
		<p>
			If things aren't working as expected, try clicking the button below to reset your app. <br
			/>Unfortunately, your data will be lost, but the app will probably start functioning as
			expected again.
		</p>

		<p>
			You may want to back up your subscriptions by exporting to OPML. You can then reload the OPML
			file once the app resets.
		</p>

		<div class="button-container">
			<Export />

			<button on:click={resetApp}>Reset App</button>
		</div>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.65);
		height: 100vh;
		width: 100vw;
		color: #ddd;
		display: none;
		place-items: center;
		z-index: 9999;
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		padding-top: 8px;
		width: calc(100% - 16px);
		height: 80%;
		background-color: #fff;
		color: #333;
		border-radius: 5px;
		overflow: auto;
	}

	.button-container {
		display: flex;
	}

	button {
		margin: 0 auto;
		height: 60px;
		width: 140px;
		margin-top: 8px;
		background-color: var(--text-color);
		color: #fff;
		border-radius: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.1em;
		font-weight: 700;
		flex: none;
	}
</style>
