<script>
	import { tagHeaders, rssData } from '$/editor';
	export let data;

	console.log(data);
	data = [].concat(data);
	console.log(data);

	$: console.log($rssData);

	let size = '100px';

	function handleInput() {
		console.log(data);
	}
</script>

{#if data.length}
	{#each data as banner, i}
		<div class="podcast-image">
			<label>
				<div class="left">
					<h3>Banner Images</h3>
				</div>

				<input
					type="text"
					bind:value={data[i]['@_url']}
					on:input={handleInput}
					placeholder="Copy Link Address to Cover Art File (file should be served from a https server)"
				/>
			</label>
			<img src={banner['@_url']} style={`width: 160px; height: 90px;`} />
		</div>
	{/each}
{/if}
