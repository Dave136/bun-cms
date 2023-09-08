import "dotenv";
import { Hono } from "hono";
import { cors } from "hono:middleware";
import initConnection from "./database.ts";
import routes from "./routes.ts";
import bindClient from "./client.ts";

initConnection();

const PORT = Deno.env.get("PORT");

const app = new Hono();

app.use("*", cors());
app.route("/api", routes);

// Bind the client UI
bindClient(app);

app.get(
  "/api",
  (c) => c.json({ message: "Alfagames API", author: "David Arenas" }),
);

Deno.serve({ port: Number(PORT) || 3030 }, app.fetch);
