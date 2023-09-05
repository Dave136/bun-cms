import { Hono } from "hono";
import { auth, consolesRoutes } from "./modules/index.ts";

const routes = new Hono();

routes.route("/auth", auth);
routes.route("/consoles", consolesRoutes);

export default routes;
