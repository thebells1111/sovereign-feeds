<script>
	export let value = 0;
	export let max = Infinity;
	export let min = -Infinity;
	export let blurDefault = 1;
	export let handleInput = () => {};
	export let disableScroll = false;
	export let blur = async () => {
		value = value || blurDefault;
		handleInput(value);
	};
	export let focus = () => {
		value = '';
	};
	export let scrollChange = () => {};
	export let disabled = false;

	function changeInput(e) {
		let i = e.target.value.toString();

		if (i.match(/[^0-9]/g)) {
			//allows only digits as input
			value = i.match(/[0-9]/g).join('');
		} else if (Number(i) > max) {
			//won't allow input to be greater than max
			value = i.split('').pop();
		}

		if (Number(value) > max) {
			// so displayed number will never be higher than single digit max number
			value = max;
		}

		value = Number(value);

		handleInput(value);
	}

	function decVal() {
		value--;
		if (value < min) {
			value = max;
		}
		handleInput(value);
	}

	function incVal() {
		value++;
		if (value > max) {
			value = min;
		}
		handleInput(value);
	}

	function mouseScroll(e) {
		if (!disableScroll) {
			if (e.deltaY > 0) {
				decVal();
			}
			if (e.deltaY < 0) {
				incVal();
			}
			scrollChange();
		}
	}

	function handleKeypress(e) {
		switch (e.key) {
			case 'Enter':
				e.target.blur();
				break;
			case 'ArrowDown':
				decVal();
				break;
			case 'ArrowUp':
				incVal();
				break;
		}
	}
</script>

<input
	bind:value
	on:input={changeInput}
	on:blur={blur}
	on:focus={focus}
	on:wheel|passive={mouseScroll}
	on:keydown={handleKeypress}
	{disabled}
/>

<style>
	input {
		background: white;
		width: 50px;
		height: 40px;
		margin: 4px;
		text-align: center;
		border-radius: 3px;
		cursor: pointer;
	}
</style>
