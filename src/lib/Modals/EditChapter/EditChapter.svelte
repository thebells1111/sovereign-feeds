<label>
	<h4>Title:</h4>
	<input type="text" bind:value={chapter.title} />
</label>
<label>
	<h4>Start Time</h4>
	<input type="text" bind:value={chapter.startTime} />
</label>
<label>
	<h4>URL:</h4>
	<input type="text" bind:value={chapter.url} />
</label>

<label>
	<h4>Image URL:</h4>
	<input type="text" bind:value={chapter.img} />
</label>
<Image src={chapter.img} />
