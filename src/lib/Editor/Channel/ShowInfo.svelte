<script>
	import { rssData, tagHeaders } from '$/editor';
	import Locked from './Components/Locked/Locked.svelte';
	import Complete from './Components/Complete/Complete.svelte';
	import License from './Components/License/License.svelte';

	let mediaTypes = ['podcast', 'music', 'video', 'film', 'audiobook', 'newsletter', 'blog'];
	let selectedMedia;

	$: if ($rssData && $rssData?.['podcast:medium']) {
		initializeMedia();
	}

	function initializeMedia() {
		selectedMedia = $rssData?.['podcast:medium'];
	}
</script>

{#if $rssData}
	<label>
		<h3>{$tagHeaders.podcast.keywords}</h3>
		<input type="text" bind:value={$rssData['itunes:keywords']} />
	</label>

	<label>
		<h3>{$tagHeaders.podcast.mediaType}</h3>
		<select
			bind:value={selectedMedia}
			on:change={() => {
				$rssData['podcast:medium'] = selectedMedia;
			}}
		>
			{#each mediaTypes as type}
				<option value={type}>
					{type}
				</option>
			{/each}
		</select>
	</label>

	<Locked />
	<Complete />
	<License />
{/if}

<!-- <label class="locked">
		<input type="checkbox" bind:checked={locked} on:change={handleLock} />
		Podcast Locked
	</label> -->
<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}
</style>
