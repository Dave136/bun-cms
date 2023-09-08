import redaxios from "redaxios";

export const api = redaxios.create({
  baseURL: "http://localhost:5000/api",
});
