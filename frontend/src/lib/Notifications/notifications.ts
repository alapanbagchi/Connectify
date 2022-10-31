// stores.js
import { writable } from 'svelte/store'

export const alert = writable({
	title: '',
	description: '',
	type: 'ERROR'
})
