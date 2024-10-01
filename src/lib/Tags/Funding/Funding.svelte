<script>
	import { rssData, tagHeaders } from '$/editor';

	export let data;
</script>

{#if data}
	<div class="funding header">
		<h3>{$tagHeaders.channel.funding.title}</h3>
		<button
			on:click={() => {
				data['podcast:funding'] = data['podcast:funding'].concat({
					'#text': '',
					'@_url': ''
				});
			}}
		>
			Add New {`${$tagHeaders.channel.funding.block}`}
		</button>
	</div>
	{#each data['podcast:funding'] as funding, i}
		<div class="funding block">
			<h4 style={`color: hsla(${352 - ((i + 1) % 4) * 90}, 100%, 33%, 1)`}>
				{`${$tagHeaders.channel.funding.block} `} #{i + 1}:
			</h4>
			<button
				on:click={(e) => {
					data['podcast:funding'].splice(i, 1);
					data['podcast:funding'] = data['podcast:funding'];
				}}
				style={`background-image: linear-gradient(
          to bottom,
          hsla(${352 - ((i + 1) % 4) * 90}, 100%, 46.7%, 1),
          hsla(${352 - ((i + 1) % 4) * 90}, 100%, 26.7%, 1)
        )`}
			>
				Delete This Block
			</button>
		</div>
		<label>
			<h5 style={`color: hsla(${352 - ((i + 1) % 4) * 90}, 100%, 33%, 1)`}>
				{$tagHeaders.channel.funding.text}
			</h5>
			<input type="text" bind:value={funding['#text']} />
		</label>
		<label>
			<h5 style={`color: hsla(${352 - ((i + 1) % 4) * 90}, 100%, 33%, 1)`}>
				{$tagHeaders.channel.funding.url}
			</h5>
			<input type="text" bind:value={funding['@_url']} />
		</label>
	{/each}
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.funding {
		display: flex;
		align-items: center;
	}
	input {
		flex-grow: 1;
		padding: 8px;
	}

	h3,
	h4,
	h5 {
		margin: 0;
		padding: 0;
		color: hsla(352, 100%, 33%, 1);
	}

	button {
		background-color: #333;
		margin: 0;
		color: #eee;
		padding: 2px 8px;
		margin: 0 8px;
		color: #f0f0f0;
		text-shadow: 0 1px #c0c0c0;
		background: #333;
		border: 1px solid;
		border-color: #cfcfcf #a7a7a7 #8e8f8f;
		border-radius: 50px;
		outline: 0;
		background-image: linear-gradient(
			to bottom,
			hsla(352, 100%, 43.7%, 1),
			hsla(352, 100%, 26.7%, 1)
		);
		box-shadow: inset 0 1px hsla(0, 0%, 42.7%, 1), 0 2px 2px rgba(0, 0, 0, 0.33);
		text-shadow: 1px 4px 6px rgb(82, 82, 82), 0 0 0 #000, 1px 4px 6px rgb(82, 82, 82);
	}

	.funding.header {
		margin-bottom: 12px;
	}

	.funding.block {
		margin: 8px 0;
	}
	.funding.block > button {
		font-size: 0.9em;
	}
</style>
