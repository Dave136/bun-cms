import { Hono } from "hono";
import httpResponse from "../../utils/http-response.ts";
import * as service from "./services.ts";
import { Role } from "./model.ts";

const user = new Hono();

user.get("/check-admin", async (c) => {
  try {
    const admin = await service.findByRole(Role.Admin);

    return httpResponse.ok(c, { adminExist: !!admin });
  } catch (error) {
    return httpResponse.internalServerError(c, error);
  }
});

user.post(
  "/:id",
  (c) => {
    return c.json({
      message: "ok",
    });
  },
);

export default user;
