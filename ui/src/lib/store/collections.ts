import { writable } from "svelte/store";

export const collections = writable([]);
export const activeCollection = writable({});
export const isCollectionsLoading = writable(false);
