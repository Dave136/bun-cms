import { api } from "$lib/config/redaxios";
import { authenticated } from "$lib/store";
import { replace } from "svelte-spa-router";

async function login(credentials: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", credentials);

  if (data.token) {
    localStorage.setItem("ag-token", data.token);
  }
}

async function logout() {
  // TODO: add logout endpoint
  // await api.post("/auth/logout");
  localStorage.removeItem("ag-token");
  authenticated.set(false);
  replace("/");
}

export default {
  login,
  logout,
};
