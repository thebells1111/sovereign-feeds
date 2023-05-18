<script>
	import { editingEpisode, tagHeaders } from '$/editor';
</script>

<div class="episode-explicit">
	<h3>{$tagHeaders.episodes.explicit}</h3>
	<div class="explicit-label-container">
		<label>
			<input type="radio" bind:group={$editingEpisode['itunes:explicit']} value={'No'} />
			No
		</label>

		<label>
			<input type="radio" bind:group={$editingEpisode['itunes:explicit']} value={'Yes'} />
			Yes
		</label>
	</div>
</div>

<style>
	.episode-explicit {
		display: flex;
		flex-direction: column;
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	.explicit-label-container {
		display: flex;
		padding-left: 8px;
	}
	.explicit-label-container > label {
		padding-right: 8px;
		margin-right: 12px;
		cursor: pointer;
	}
</style>
