import { Hono } from "hono";
import basicAuth, { BasicAuthError } from "./utils.ts";
import * as authService from "./service.ts";
import * as userService from "../user/services.ts";
import httpResponse from "../../utils.ts";
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
      if (!c.req.headers.get("authorization")) {
        return httpResponse.badRequest(c, "Missing Authorization Header");
      }

      const authorization = c.req.headers.get("authorization") as string;
      const credentials = basicAuth(authorization);
      const {
        token,
        refreshToken,
      } = await authService.authenticate(credentials);

      c.res.headers.set("x-api-token", token);
      c.res.headers.set("x-refresh-token", refreshToken);

      return httpResponse.ok(c, {
        token,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof BasicAuthError) {
        return httpResponse.badRequestWithError(
          c,
          `Missing HTTP Header: "Authorization"`,
          error,
        );
      }

      if (
        error instanceof UserByEmailNotFound ||
        error instanceof InvalidCredentials
      ) {
        return httpResponse.forbiddenWithError(c, "Invalid Credentials", error);
      }

      return httpResponse.internalServerError(c, error);
    }
  },
);

route.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const user = await userService.create(body);

    user.password = "";

    return httpResponse.created(c, user);
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
