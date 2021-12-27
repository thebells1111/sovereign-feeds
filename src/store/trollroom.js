import { writable } from 'svelte/store';
import { browser } from '$app/env';

export let socket = writable(null);
