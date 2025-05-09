<script context="module">
	import { EditorView, minimalSetup, basicSetup } from 'codemirror';
	import { ViewPlugin } from '@codemirror/view';
	import { StateEffect } from '@codemirror/state';
	export { minimalSetup, basicSetup };
</script>

<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let dom;

	let _mounted = false;
	onMount(() => {
		_mounted = true;
		view.focus();
		return () => {
			_mounted = false;
		};
	});

	export let view = null;

	/* `doc` is deliberately made non-reactive for not storing a reduntant string
     besides the editor. Also, setting doc to undefined will not trigger an
     update, so that you can clear it after setting one. */
	export let doc;

	/* Set this if you would like to listen to all transactions via `update` event. */
	export let verbose = false;

	/* Cached doc string so that we don't extract strings in bulk over and over. */
	let _docCached = null;

	/* Overwrite the bulk of the text with the one specified. */
	function _setText(text) {
		view.dispatch({
			changes: { from: 0, to: view.state.doc.length, insert: text }
		});
	}

	const subscribers = new Set();

	/* And here comes the reactivity, implemented as a r/w store. */
	export const docStore = {
		ready: () => view !== null,
		subscribe(cb) {
			subscribers.add(cb);

			if (!this.ready()) {
				cb(null);
			} else {
				if (_docCached == null) {
					_docCached = view.state.doc.toString();
				}
				cb(_docCached);
			}

			return () => void subscribers.delete(cb);
		},
		set(newValue) {
			if (!_mounted) {
				throw new Error('Cannot set docStore when the component is not mounted.');
			}

			const inited = _initEditorView(newValue);
			if (!inited) _setText(newValue);
		}
	};

	export let extensions = minimalSetup;

	function _reconfigureExtensions() {
		if (view === null) return;
		view.dispatch({
			effects: StateEffect.reconfigure.of(extensions)
		});
	}

	$: extensions, _reconfigureExtensions();

	function _editorTxHandler(tr) {
		if (!this) return; // Add a guard to prevent errors if `this` is undefined
		this.update([tr]);

		if (verbose) {
			dispatch('update', tr);
		}

		if (tr.docChanged) {
			_docCached = null;
			if (subscribers.size) {
				dispatchDocStore((_docCached = tr.newDoc.toString()));
			}
			dispatch('change', { view: this, tr });
		}
	}

	function dispatchDocStore(s) {
		for (const cb of subscribers) {
			cb(s);
		}
	}

	// the view will be inited with the either doc (as long as that it is not `undefined`)
	// or the value in docStore once set
	function _initEditorView(initialDoc) {
		if (view !== null) {
			return false;
		}

		view = new EditorView({
			doc: initialDoc,
			extensions,
			parent: dom,
			dispatch: (tr) => _editorTxHandler.call(this, tr) // Maintain context
		});

		view.focus(); // Ensure the editor has focus
		return true;
	}

	$: if (_mounted && doc !== undefined) {
		const inited = _initEditorView(doc);
		dispatchDocStore(doc);
	}

	onDestroy(() => {
		if (view !== null) {
			view.destroy();
		}
	});
</script>

<div class="codemirror" bind:this={dom} />

<style>
	.codemirror {
		display: contents;
	}
</style>
