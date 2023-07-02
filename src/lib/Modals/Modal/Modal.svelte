<script>
	import Close from '$lib/icons/Close.svelte';
	export let showModal;
	export let unsaved = false;
	function closeModal() {
		if (unsaved) {
			const userConfirmation = window.confirm('Your changes are unsaved. Do you want to continue?');
			if (userConfirmation) {
				showModal = false;
				unsaved = false;
			}
		} else {
			showModal = false;
		}
	}
</script>

{#if showModal}
	<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
		<modal>
			<button class="close icon" on:click={closeModal}>
				<Close size="24" />
			</button>
			<modal-content>
				<slot />
			</modal-content>
			<fade-bottom />
		</modal>
	</blurred-background>
{/if}

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	modal {
		display: block;
		position: relative;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
	}

	modal-content {
		display: flex;
		flex-direction: column;
		padding: 40px 0px 0px 0px;
		width: 100%;
		align-items: center;
	}

	button {
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(0, 0, 0, 0.75);
		z-index: 33;
		border: 1px solid transparent;
	}

	fade-bottom {
		display: block;
		height: 20px;
		width: 100%;
		background: linear-gradient(to bottom, transparent, white);
		position: absolute;
		bottom: 0px;
	}

	@media screen and (max-width: 992px) {
		modal {
			position: relative;
			width: 100%;
			height: calc(100%);
			overflow-y: auto;
			overflow-x: hidden;
			border-radius: 0;
		}
	}
</style>
