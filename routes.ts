import { Hono } from "hono";
import { auth, user } from "./modules/index.ts";

const routes = new Hono();

routes.route("/auth", auth);

export default routes;
