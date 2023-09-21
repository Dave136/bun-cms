import toast from "svelte-french-toast";
import { ofetch } from "ofetch";
import { isTokenExpired } from "$lib/jwt";
import auth from "$lib/services/auth";

export const api = ofetch.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("ag-token"),
  },
  async onRequestError({ response }) {
    const token = localStorage.getItem("ag-token");
    const isExpired = isTokenExpired(token ?? "");

    if (response?.status === 401 || isExpired) {
      try {
        localStorage.removeItem("ag-token");
        const token = await auth.refresh();

        localStorage.setItem("ag-token", token);
      } catch (error) {
        toast.error("Por favor, inicie sesión nuevamente");
      }
    }
  },
});
