import { Hono } from "hono";
import { auth, consolesRoutes, games } from "./modules/index.ts";

const routes = new Hono();

routes.route("/auth", auth);
routes.route("/consoles", consolesRoutes);
routes.route("/games", games);

export default routes;
