import { writable } from "svelte/store";

export const authenticated = writable(false);

authenticated.subscribe(() => {
  const jwt = localStorage.getItem("ag-token");
  return !!jwt;
});

authenticated.update(() => {
  const jwt = localStorage.getItem("ag-token");
  return !!jwt;
});
