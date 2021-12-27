<script>
	import SharedImageComponent from './SharedImageComponent.svelte';

	import { rssData, editingEpisode } from '$/editor';

	let type = 'episode';

	let paneWidth;
	$: activeTab = type === 'episode' ? 0 : 1;
	$: buttonOffset = (paneWidth / 2 - 100) / 2;
	$: activeOffset = (paneWidth / 2) * activeTab + buttonOffset;
</script>

{#if $rssData}
	<section class="tab-zone" bind:clientWidth={paneWidth}>
		<button class:active={type === 'episode'} on:click={() => (type = 'episode')}>
			<p>Episode</p>
		</button>
		<button class:active={type === 'podcast'} on:click={() => (type = 'podcast')}>
			<p>Podcast</p>
		</button>
		<div class="active-tab" style={`margin-left:${activeOffset}px`} />
	</section>
	<div class="extra-wide" style={`right:${type === 'episode' ? '100%' : '0'}`}>
		<SharedImageComponent bind:data={$rssData['podcast:images']} type="podcast" />
		<SharedImageComponent bind:data={$editingEpisode['podcast:images']} type="episode" />
	</div>
{/if}

<style>
	.extra-wide {
		width: 200%;
		display: flex;
		overflow: hidden;
		position: relative;
		right: 100%;
		transition: right 0.3s ease-in-out;
	}
	.tab-zone {
		display: flex;
		position: relative;
	}

	.active-tab {
		position: absolute;
		content: '';
		height: 2px;
		width: 100px;
		background-color: hsla(352, 100%, 33%, 1);
		bottom: 18px;
		left: 0;
		border-radius: 3px;
		transition: 0.3s ease-in-out;
	}

	.tab-zone button {
		width: 100%;
		height: 50px;
		background-color: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.tab-zone button > p {
		margin: 0;
		padding: 0;
		width: 100px;
		text-align: center;
		position: relative;
	}

	button.active {
		font-weight: 600;
		font-size: 1.05em;
		border-bottom-color: transparent;
		color: hsla(352, 100%, 33%, 1);
		transition: 0.3s ease-in-out;
	}
</style>
