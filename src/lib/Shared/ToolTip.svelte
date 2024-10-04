<script>
	import { fade } from 'svelte/transition';

	let tooltipVisible = false;
	let timeoutID;
	let tooltipRef;
	let questionRef;

	let tooltipPosition = { top: '40px', left: '0px' };

	const calculatePosition = () => {
		const { top, left } = questionRef.getBoundingClientRect();
		const { innerWidth, innerHeight } = window;
		const tooltipWidth = tooltipRef.offsetWidth;
		const tooltipHeight = tooltipRef.offsetHeight;

		let computedLeft = left;
		let computedTop = top + questionRef.offsetHeight + 10;

		if (left + tooltipWidth > innerWidth) {
			computedLeft = innerWidth - tooltipWidth - 10;
		}
		if (top + tooltipHeight > innerHeight) {
			computedTop = top - tooltipHeight - 10;
		}

		tooltipPosition = {
			top: `${computedTop}px`,
			left: `${computedLeft}px`
		};
	};

	const handleMouseOver = () => {
		clearTimeout(timeoutID);
		tooltipVisible = true;

		setTimeout(calculatePosition, 0);
	};

	const handleMouseLeave = () => {
		timeoutID = setTimeout(() => {
			tooltipVisible = false;
		}, 0);
	};
</script>

<div
	class="question"
	bind:this={questionRef}
	on:mouseover={handleMouseOver}
	on:mouseleave={handleMouseLeave}
>
	?
</div>

{#if tooltipVisible}
	<div
		class="tooltip {tooltipVisible ? 'visible' : ''}"
		bind:this={tooltipRef}
		on:mouseover={handleMouseOver}
		on:mouseleave={handleMouseLeave}
		transition:fade={{ duration: 750 }}
		style={`top: ${tooltipPosition.top}; left: ${tooltipPosition.left};`}
	>
		<slot />
	</div>
{/if}

<style>
	.tooltip {
		position: fixed;
		padding: 10px;
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.75);
		color: white;
		z-index: 9999;
		white-space: nowrap;
	}

	.question {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #999;
		color: white;
		font-size: 16px;
		cursor: pointer;
	}
</style>
