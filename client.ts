import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const ASSETS_ROUTE = "/_/assets/*";
const ADMIN_ROUTE = "/_/*";
const CLIENT_BUILD = "dist";

const rewriteRequestPath = (path: string) => path.replace("/_/", "");

export default function bindClient(app: Hono) {
  app.use(
    ASSETS_ROUTE,
    serveStatic({
      root: CLIENT_BUILD,
      rewriteRequestPath,
    })
  );

  app.use(
    ADMIN_ROUTE,
    serveStatic({
      root: CLIENT_BUILD,
      rewriteRequestPath,
    })
  );
}
