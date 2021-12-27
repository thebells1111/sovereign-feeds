<script>
	let files;

	function upload() {
		const formData = new FormData();
		formData.append('file', files[0]);
		const upload = fetch(`http://localhost:8000/upload?folder=${encodeURIComponent('test/cool')}`, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.text())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

<input id="fileUpload" type="file" bind:files />
<button on:click={upload}>Submit</button>

{#if files?.[0]}
	<p>
		{files[0].name}
	</p>
{/if}
