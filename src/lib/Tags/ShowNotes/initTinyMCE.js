import { editingEpisode, episodesList } from '$/editor';
import { get } from 'svelte/store';

let editorChangeHandlerId;

export default function initTinyMCE() {
	if (get(editingEpisode)) {
		window.tinymce.init({
			selector: '#tiny-editor-description',
			plugins: 'lists link image code media charmap emoticons anchor codesample paste',
			paste_data_images: false,
			paste_webkit_styles: 'none',
			menubar: '',
			toolbar:
				'undo redo | formatselect | fontsizeselect | charmap emoticons | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | image media link anchor codesample',
			toolbar_sticky: true,
			toolbar_mode: 'wrap',
			// toolbar_mode: 'floating',
			branding: false,
			resize: false,
			statusbar: false,
			height: '100%',
			width: '100%',
			paste_preprocess: function (plugin, args) {
				let h = args.content;
				h = h.replace(/ class="([^"]+)"/gi, '');
				h = h.replace(/ class=([\-\w]+)/gi, '');
				args.content = h;
			},
			paste_postprocess: function (plugin, args) {
				checkForUL(args.node);

				checkForLi(args.node);

				function checkForUL(node) {
					let ulNodes = node.querySelectorAll('ul');
					for (let ul of ulNodes) {
						ul.replaceWith(...ul.childNodes);
					}
				}

				function checkForLi(node) {
					let lists = node.querySelectorAll('li');
					for (let li of lists) {
						let p = document.createElement('p');
						p.innerHTML = li.innerHTML;
						checkForUL(p);
						checkForLi(p);
						li.parentNode.insertBefore(p, li);
						li.remove();
					}
				}
			},
			setup: function (editor) {
				editor.on('Paste Change input Undo Redo', function () {
					clearTimeout(editorChangeHandlerId);
					editorChangeHandlerId = setTimeout(function () {
						let $editingEpisode = get(editingEpisode);
						$editingEpisode.description = tinymce.activeEditor.getContent();
						$editingEpisode['itunes:summary'] = $editingEpisode.description;
						editingEpisode.set($editingEpisode);
						episodesList.update((n) => n);
					}, 100);
				});
			}
		});
	}
}
