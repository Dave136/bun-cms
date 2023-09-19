import { Hono } from "hono";
import { auth, consolesRoutes, games, user } from "./modules";

const routes = new Hono();

routes.route("/auth", auth);
routes.route("/users", user);
routes.route("/consoles", consolesRoutes);
routes.route("/games", games);

export default routes;
