<div class="bar">
	<span class="bubble" />
</div>
<div class="uploading">Uploading File</div>

<style>
	.uploading {
		width: 100%;
		text-align: center;
		color: hsl(226, 82%, 30%);
	}
	.bar {
		position: relative;
		width: 100%;
		height: 20px;
		overflow: hidden;
		text-align: center;
		border: 1px solid hsl(226, 82%, 30%);
		border-radius: 20px;
	}

	.bubble {
		position: absolute;
		animation: 2s bounce linear infinite;
		white-space: nowrap;
		top: 0;
		height: 18px;
		width: 100%;
		border-radius: 32px;
		background-color: hsl(226, 82%, 50%);
	}

	@keyframes bounce {
		0% {
			left: -110%;
			transform: translate(0, 0);
		}
		100% {
			left: 210%;
			transform: translate(-100%, 0);
		}
	}
</style>
