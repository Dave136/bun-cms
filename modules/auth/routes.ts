import { Hono } from "hono";
import * as authService from "./service.ts";
import * as userService from "../user/services.ts";
import httpResponse from "../../utils/http-response.ts";
import {
  AdminUserAlreadyExists,
  InvalidCredentials,
  UserByEmailNotFound,
} from "../user/error.ts";

const route = new Hono();

route.post(
  "/login",
  async (c) => {
    try {
      const credentials = await c.req.json();

      if (!credentials) {
        return httpResponse.badRequest(c, "Missing credentials");
      }

      const {
        token,
      } = await authService.authenticate(credentials);

      return httpResponse.ok(c, {
        token,
      });
    } catch (error) {
      console.error(error);

      if (
        error instanceof UserByEmailNotFound ||
        error instanceof InvalidCredentials
      ) {
        return httpResponse.unauthorizedWithError(
          c,
          "Invalid Credentials",
          error,
        );
      }

      return httpResponse.internalServerError(c, error);
    }
  },
);

route.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const user = await userService.create(body);
    const codes = user.recoveryCodes;

    return httpResponse.created(c, {
      user: user.mapped(),
      codes: codes.join("."),
    });
  } catch (error) {
    if (error instanceof AdminUserAlreadyExists) {
      return httpResponse.badRequestWithError(
        c,
        error.message,
      );
    }

    return httpResponse.internalServerError(c, error);
  }
});

export default route;
