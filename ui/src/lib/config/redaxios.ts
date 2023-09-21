import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("ag-token"),
  },
});
