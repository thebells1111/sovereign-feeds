<blurred-background>
	<modal>
		<modal-content>
			<slot />
		</modal-content>
	</modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	modal {
		display: block;
		position: relative;
		padding: 20px;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
	}
</style>
