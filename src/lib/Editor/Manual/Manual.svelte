<script>
	import CodeMirror from './CodeMirror.svelte';
	import { basicSetup, EditorView } from 'codemirror';
	import { xml } from '@codemirror/lang-xml';
	import { feedText, currentPage } from '$/editor';
	let store;

	function changeHandler({ detail: { tr } }) {
		$feedText = $store;
	}

	$: handleNewText($currentPage);

	function handleNewText(page) {
		setTimeout(() => {
			if (page === 'manual' && store) {
				store.set($feedText);
			}
		}, 100);
	}
</script>

<div class="container">
	<p>Editing your feed by hand can cause problems if you don't know what you're doing.</p>
	<div class="code-mirror-container">
		{#if $feedText}
			<CodeMirror
				bind:doc={$feedText}
				bind:docStore={store}
				extensions={[basicSetup, xml(), EditorView.lineWrapping]}
				on:change={changeHandler}
			/>
		{/if}
	</div>
	<footer>
		<p>Don't forget to save (ctrl + s) after making your edits.</p>
		<p>Use ctrl + f to use the search feature</p>
	</footer>
</div>

<style>
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.code-mirror-container {
		overflow: auto;
		border: 1px solid gray;
	}

	p {
		padding: 0;
		margin: 8px;
		text-align: center;
		font-weight: 600;
		color: red;
	}

	.container > p:first-of-type {
		margin-top: 0;
	}

	footer {
		display: flex;
		justify-content: space-between;
	}
</style>
