import "dotenv";

import { Hono } from "hono";
import { cors, serveStatic } from "hono:middleware";
import initConnection from "./database.ts";
import routes from "./routes.ts";
import { getMimeType } from "./utils/mime.ts";

initConnection();

const PORT = Deno.env.get("PORT");

const app = new Hono();

console.log(Deno.cwd());

app.use("*", cors());
app.use("/assets/*", serveStatic({ root: "./ui/dist" }));
app.use("/*", serveStatic({ root: "./ui/dist" }));
app.route("/api", routes);
app.use("/admin", async (c) => {
  const path = "./ui/dist/index.html";
  const file = await Deno.open(path);

  if (file) {
    const mimeType = getMimeType(path);
    c.header("Content-Type", mimeType);

    return c.body(file.readable);
  }
});

app.get("/", (c) => c.json({ message: "Alfagames API - Dave136" }));

Deno.serve({ port: Number(PORT) || 3030 }, app.fetch);
