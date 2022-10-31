import { writable } from "svelte/store";

export const todoStore: any = writable([]);

export const currentTodo: any = writable({});

export const showEditTodo: any = writable(false);