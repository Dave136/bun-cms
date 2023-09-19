import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import routes from "./routes";
import bindClient from "../client";
import "./database";

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT: number =
  NODE_ENV === "production" ? +(process.env.PORT || 3030) : 5000;

const app = new Hono();

app.use("*", cors());
app.use("*", logger());
app.route("/api", routes);

// Bind the client UI
bindClient(app);

app.get("/api", (c) =>
  c.json({ message: "Alfagames API", author: "David Arenas" })
);

console.log(`[${NODE_ENV}] Server running on port ${PORT}`);

export default {
  port: Number(PORT) || 5000,
  fetch: app.fetch,
} as unknown;
