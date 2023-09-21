import { api } from "$lib/config/api";
import { authenticated } from "$lib/store";
import { replace } from "svelte-spa-router";

async function login(credentials: { email: string; password: string }) {
  const data = await api("/auth/login", {
    method: "post",
    body: credentials,
  });

  if (data.token) {
    localStorage.setItem("ag-token", data.token);
  }
}

async function registerAdmin(payload: {
  email: string;
  password: string;
  name: string;
  lastname: string;
}): Promise<string> {
  const data = await api("/auth/register", {
    method: "post",
    body: {
      ...payload,
      role: "admin",
    },
  });

  return data?.codes || "";
}

async function refresh(): Promise<string> {
  const data = await api("/auth/refresh", {
    method: "post",
  });

  return data.token;
}

async function logout() {
  // TODO: add logout endpoint
  // await api("/auth/logout", { method: 'post' });
  localStorage.removeItem("ag-token");
  authenticated.set(false);
  replace("/");
}

export default {
  login,
  logout,
  refresh,
  registerAdmin,
};
