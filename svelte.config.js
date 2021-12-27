import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			server: {
				port: 3333
			},
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$functions: path.resolve('src', 'functions'),
					$: path.resolve('src', 'store')
				}
			}
		}
	}
};

export default config;
