import { Hono } from "hono";

const user = new Hono();

user.post(
  "/:id",
  (c) => {
    return c.json({
      message: "ok",
    });
  },
);

export default user;
