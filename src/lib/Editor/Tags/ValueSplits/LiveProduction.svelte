<script>
	import { valueAudioItem, editingAudioItem } from '$/editor';

	import AudioItem from './AudioItem.svelte';
	import CreateValueBlock from './CreateValueBlock.svelte';
	export let activeValueBlock = {};
	export let syncedTime = 0;
	export let socket;
	export let isPCValue = true;
	export let showSocketConnect = false;
	export let handleNewEpisode = () => {};
	export let socketConnect = () => {};
	export let showMismatchedFeeds = false;

	let basePercent = 95;
	let playSongOnSync = false;
	let playAllSongs = true;
	let defaultValueSwitch = true;
	let player;
	let activeView = 'create';

	$: togglePlayer(playSongOnSync);

	function togglePlayer() {
		if (playSongOnSync) {
			player = new Audio();
		} else {
			if (player) {
				player.pause();
				player.currentTime = 0;
			}
			player = null;
		}
	}

	function syncSong(song) {
		song.added = syncedTime;
		$valueAudioItem = $valueAudioItem;
	}

	$: if ($editingAudioItem) {
		activeView = 'create';
	}
</script>

<container>
	{#if showSocketConnect}
		{#if socket}
			<left-pane>
				<left-select>
					<button class="primary create-value" on:click={() => (activeView = 'create')}
						>Create Value Block</button
					>
					<button class="primary show-value" on:click={() => (activeView = 'valueBlock')}
						>Show Active Value Block</button
					>
				</left-select>

				<active-create class:hidden={activeView != 'create'}>
					<CreateValueBlock {basePercent} />
				</active-create>

				<active-value class:hidden={activeView != 'valueBlock'}>
					<h2>Active Value Block</h2>

					{#if isPCValue}
						Using Podcaster's Value Block
					{:else if activeValueBlock.meta}
						<active-meta>
							<img src={activeValueBlock.meta.artwork} width="100" height="100" />
							<info>
								<p><b>Song: </b>{activeValueBlock.meta.song}</p>
								<p><b>Artist: </b>{activeValueBlock.meta.author}</p>
								<p><b>Album: </b>{activeValueBlock.meta.album}</p>
							</info>
						</active-meta>

						<h3>Remote Value Block</h3>
						<ul>
							{#each activeValueBlock.remote || [] as item}
								<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
							{/each}
						</ul>

						<h3>Podcaster's Value Block</h3>
						<ul>
							{#each activeValueBlock.base || [] as item}
								<li>({item.split}% {item.fee ? 'fee' : ''}) {item.name}</li>
							{/each}
						</ul>

						<h3 class="disclaimer">SF Live</h3>
						<p class="disclaimer">5% is added when using this service to cover server costs</p>
						<ul>
							<li>({activeValueBlock.sf.split}%) SF Live</li>
						</ul>
					{/if}
				</active-value>
			</left-pane>

			<playlist>
				<label>
					Add new blocks at <input
						class="base-remote-split"
						bind:value={basePercent}
						type="number"
						min="0"
						max="100"
					/>% split
				</label>
				<audio-items>
					{#if $valueAudioItem?.length}
						<AudioItem
							{syncSong}
							bind:activeValueBlock
							liveproduction="true"
							bind:isPCValue
							{socket}
							{player}
							{playSongOnSync}
							{playAllSongs}
							{defaultValueSwitch}
						/>
					{/if}
				</audio-items>
				<settings>
					<label>
						<input type="checkbox" bind:checked={playSongOnSync} />Play Songs
					</label>
					{#if playSongOnSync}
						<label>
							<input type="checkbox" bind:checked={playAllSongs} />Play Next Song Automatically
						</label>
					{/if}
					<label>
						<input type="checkbox" bind:checked={defaultValueSwitch} />Auto Switch to Podcaster's
						Wallet
					</label>
				</settings>
			</playlist>
		{:else}
			<button class="primary socket-connect" on:click={socketConnect}
				>Connect to Live Value Server</button
			>
		{/if}
	{:else}
		<div class="warning">
			<h3>You need a Sovereign Feeds Live Value Link present in your feed to use this feature.</h3>
			<h3>
				Go to the Live Info Tab to generate your link, then publish your feed with the new link.
			</h3>
			<h3>
				After your feed has been published with your new link, click the button below to use the
				Live Value Tool.
			</h3>

			<button class="primary live-check" on:click={handleNewEpisode}>Use Live Value Tool</button>
			{#if showMismatchedFeeds}
				<p class="mismatch">Ensure that your published feed matches your Live Value Link.</p>
			{/if}
		</div>
	{/if}
</container>

<style>
	container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		gap: 0px 0px;
		grid-template-areas: 'left-pane playlist';
		overflow: hidden;
		flex: 1;
		position: relative;
	}

	ul {
		padding: 0;
	}

	li {
		list-style: none;
		cursor: pointer;
	}

	left-pane {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		grid-area: left-pane;
		border-right: 1px solid var(--border-color);
		height: 100%;
	}

	list-container {
		overflow-y: auto;
		overflow-x: hidden;
	}

	playlist {
		display: flex;
		grid-area: playlist;
		overflow: hidden;
		flex-direction: column;
	}

	playlist label {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 24px;
	}

	playlist label input {
		width: 55px;
		text-align: center;
		margin: 0 0 0 6px;
	}

	sync {
		display: flex;
		flex-direction: column;
		grid-area: sync;
		margin: 0 8px;
		padding-top: 16px;
		align-items: center;
		border-top: 1px solid var(--border-color);
	}

	sync p {
		margin: 8px;
	}

	audio-items {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
	}

	left-select {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
	}

	left-select button {
		margin: 0 16px;
	}

	.hidden {
		display: none;
	}

	.show-value {
		background-image: linear-gradient(
			to bottom,
			hsla(197, 100%, 43.7%, 1),
			hsla(197, 100%, 26.7%, 1)
		);
	}

	.create-value {
		background-image: linear-gradient(to bottom, hsl(253, 100%, 44%), hsl(253, 100%, 26.7%));
	}

	p.disclaimer {
		padding: 0 0 18px 8px;
	}

	h3.disclaimer {
		margin-bottom: 0;
	}

	.warning {
		position: absolute;
		margin: 0 auto;
		text-align: center;
		width: 100%;
	}

	.live-check {
		width: 250px;
		background-image: linear-gradient(to bottom, hsl(326, 100%, 44%), hsl(326, 100%, 26.7%));
	}

	.mismatch {
		color: red;
	}

	.primary {
		width: 200px;
	}

	active-create {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.socket-connect {
		margin: 40px auto;
		width: 250px;
		background-image: linear-gradient(to bottom, hsl(277, 100%, 44%), hsl(277, 100%, 26.7%));
		position: absolute;
		top: 50px;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
