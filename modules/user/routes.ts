import { Hono } from "hono";
import User from "./model.ts";

const user = new Hono();

user.post(
  "/register",
  async (c) => {
    const body = await c.req.json();
    const found = await User.findOne({ email: body.email });

    if (found) {
      return c.json({
        message: "User already exists",
      }, 404);
    }

    return c.json({
      message: "ok",
    });
  },
);

export default user;
