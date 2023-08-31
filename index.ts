import "dotenv";

import { Hono } from "hono";
import { cors } from "hono:cors";
import initConnection from "./db.ts";

initConnection();

const PORT = Deno.env.get("PORT");

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => c.json({ message: "Alfagames API - Dave136" }));

Deno.serve({ port: Number(PORT) || 3030 }, app.fetch);
