<script>
	import JSZip from 'jszip';
	import { saveAs } from 'file-saver';
	import buildRSS from './buildrss';

	import { showBuildingRSS } from '$/editor';

	async function parseRSS() {
		$showBuildingRSS = true;
		let { title, xmlFile } = await buildRSS();
		console.log(xmlFile);
		if (!xmlFile) {
			$showBuildingRSS = false;
			return;
		}
		let date = new Date();
		let d = date.toLocaleString('en-US', { hour12: false });

		// var zip = new JSZip();
		// zip.file(
		// 	`${title} - ${d.replace(/\//g, '-').replace(',', '').replace(/:/g, '.')}.xml`,
		// 	xmlFile
		// );
		// let content = await zip.generateAsync({ type: 'blob' });

		// console.log(xmlFile);
		var blob = new Blob([xmlFile], { type: 'text/plain;charset=utf-8' });

		saveAs(blob, `${title} - ${d.replace(/\//g, '-').replace(',', '').replace(/:/g, '.')}.xml`);
		// initializeRSSData();
		$showBuildingRSS = false;
	}
</script>

<p>Click below to download your RSS feed to your local machine.</p>
<button class="primary" on:click={parseRSS}>Download RSS File</button>

<style>
	button.primary {
		width: 50%;
		margin: 0 25%;
	}

	p {
		text-align: center;
		padding: 0;
		margin-bottom: 4px;
	}
</style>
