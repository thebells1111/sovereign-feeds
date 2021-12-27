<script>
	import { showPreferences, useP2P, userState, userStateDB, enableAutoplay } from '$/stores';

	function handleUseP2P(e) {
		$useP2P = e.target.checked;
		$userState.useP2P = $useP2P;
		userStateDB.setItem('userState', $userState);
	}

	function handleEnableAutoplay(e) {
		$enableAutoplay = e.target.checked;
		$userState.enableAutoplay = $enableAutoplay;
		userStateDB.setItem('userState', $userState);
		console.log($enableAutoplay);
	}
</script>

<section class:active={$showPreferences} on:click|self={() => ($showPreferences = false)}>
	<div class="scroll-bar-clipper">
		<ul>
			<li>
				<label class="checkbox">
					<input type="checkbox" on:change={handleUseP2P} checked={$useP2P} />
					<span> Help share videos being played</span>
					<p>
						The sharing system implies that some technical information about your system (such as a
						public IP address) can be sent to other peers, but greatly helps to reduce server load.
					</p>
				</label>
			</li>
			<li>
				<label class="checkbox">
					<input type="checkbox" on:change={handleEnableAutoplay} checked={$enableAutoplay} />
					<span> Enable Autoplay</span>
					<p>
						Continue to next episode in playlist or episode list when current episode completes.
					</p>
				</label>
			</li>
		</ul>
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
		padding: 8px;
		width: calc(100% - 16px);
		height: 80%;
		background-color: #fff;
		color: #333;
		border-radius: 5px;
		overflow: auto;
	}

	ul {
		width: 100%;
		padding: 0;
		margin: 0;
		display: initial;
		overflow: hidden;
	}

	li {
		list-style: none;
		cursor: pointer;
		position: relative;
	}

	.checkbox {
		cursor: pointer;
		position: relative;
		height: 100%;
		width: 100%;
	}

	.checkbox > span {
		padding: 0 0.25em;
	}

	.checkbox > input {
		height: 15px;
		width: 15px;
		-webkit-appearance: none;
		-moz-appearance: none;
		-o-appearance: none;
		appearance: none;
		border: 1px solid #333;
		border-radius: 4px;
		outline: none;
		background-color: transparent;
		cursor: pointer;
		margin: 0;
		position: relative;
		top: 3px;
	}

	.checkbox > input:checked::before {
		content: '\2713';
		display: block;
		text-align: center;
		position: absolute;
		right: -4px;
		bottom: -4px;
		font-size: 1.4em;
		font-weight: 700;
	}

	p {
		font-size: 12px;
		margin-left: 24px;
	}
</style>
