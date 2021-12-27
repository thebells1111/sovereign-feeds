<script>
	import Sync from '$lib/icons/Sync.svelte';
	import { showServerSendingErrorMsg, showServerSending, podpingMessage } from '$/editor';
</script>

<div class="modal">
	<div class="sync-container">
		<div class="syncing-feed">
			<p>{$podpingMessage || ''}</p>
			<h1 class:error={$showServerSendingErrorMsg}>
				{@html $showServerSendingErrorMsg || 'Sending to Server'}
			</h1>
			{#if !$showServerSendingErrorMsg}
				<div class="animated-sync"><Sync size="9em" /></div>
			{/if}
			{#if $showServerSendingErrorMsg}
				<button
					class="close primary"
					on:click={() => {
						$showServerSendingErrorMsg = '';
						$showServerSending = false;
					}}
				>
					Close
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	h1 {
		text-align: center;
	}

	.modal {
		position: absolute;
		width: calc(100% + 8px);
		height: calc(100% + 48px);
		left: -8px;
		top: -48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 0%, 0.451);
		z-index: 3;
	}

	.sync-container {
		background-color: white;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}
	.syncing-feed {
		height: 300px;
		width: 300px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.syncing-feed h1 {
		margin: 30px 0 0 0;
	}

	.syncing-feed .error {
		margin: 0;
	}

	.animated-sync {
		width: 300px;
		height: 200px;
		animation-name: rotate;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		border-radius: 50%;
		display: grid;
		place-content: center;
		position: relative;
		top: -21px;
	}

	p {
		position: absolute;
		top: 0;
		color: hsl(0, 100%, 33%);
	}

	button {
		margin: 8px;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
</style>
