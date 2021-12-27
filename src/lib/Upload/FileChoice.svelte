<script>
	import { selectedPodcast } from '$/editor';

	export let fileUrl;
	export let fileName;
	export let showUpload;

	function handleFileUrl(link) {
		console.log(link);
		fileName = link;
		fileUrl = undefined;
		showUpload = false;
		$selectedPodcast.url = fileName;
		console.log($selectedPodcast);
	}
</script>

<div class="container">
	<h1>File Uploaded</h1>

	<div class="file">
		<input type="text" value={fileUrl.cdn} readonly />
		<button class="primary" on:click={handleFileUrl.bind(this, fileUrl.cdn)}>use cached file</button
		>
	</div>

	<div class="file">
		<input type="text" value={fileUrl.origin} readonly />
		<button class="primary" on:click={handleFileUrl.bind(this, fileUrl.origin)}
			>use non-cached file</button
		>
	</div>

	<p class="cached">
		If you haven't already set up your Spaces for using the cached version,<br />please do so by
		<a href="https://docs.digitalocean.com/products/spaces/how-to/enable-cdn/">
			following these instructions.
		</a>
	</p>
	<p>
		<span class="bold">Non-cached files</span> are served directly from your Digital Oceans server. Using
		this option means your file is always up to date, but also increases your total bandwidth usage.
		This may be useful if your feed uses the liveItem tag to ensure a podcast player can read the most
		recent copy of your feed. Generally though, using the cached version is preferred.
	</p>
	<p>
		<span class="bold">Cached files</span> are served using a CDN. This means your file is loaded to
		several servers, and the bandwidth is applied to those servers rather than yours, keeping your total
		bandwidth usage lower. It also means your files will be sent to the listener faster because they
		will be getting it from a server closer to them. Using this option means any changes to an existing
		file may take several hours before your listeners are downloading the updated file. For files that
		are expected to remain unchanged for long periods, such as mp3 files, images, and infrequently updated
		feeds, using the cached version is preferred.
	</p>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	h1 {
		margin: 0 0 8px 0;
		color: hsl(226, 82%, 30%);
	}

	.cached {
		text-align: center;
		color: hsl(0, 100%, 33%);
		font-weight: 600;
	}

	a {
		color: hsl(226, 82%, 50%);
	}

	.file {
		display: flex;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		margin-right: 8px;
	}

	button {
		min-width: 153px;
	}

	p {
		padding: 0;
		margin: 0 0 8px 0;
	}

	.bold {
		font-weight: 650;
		color: hsl(226, 82%, 30%);
	}
</style>
