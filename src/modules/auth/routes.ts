import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import * as authService from "./service.ts";
import * as userService from "../user/services.ts";
import httpResponse from "../../utils/http-response.ts";
import {
  AdminUserAlreadyExists,
  InvalidCredentials,
  UserByEmailNotFound,
} from "../user/error.ts";
import { ExpiredTokenProvidedForRefresh } from "./error.ts";
import { errors } from "jose";

const route = new Hono();

route.post("/login", async (c) => {
  try {
    const credentials = await c.req.json();

    if (!credentials) {
      return httpResponse.badRequest(c, "Missing credentials");
    }

    const { token, refreshToken } = await authService.authenticate(credentials);

    setCookie(c, "refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Strict",
      domain: "http://localhost:5173",
      path: "/",
      // signingSecret: process.env.JWT_PRIVATE_KEY,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

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
        error
      );
    }

    return httpResponse.internalServerError(c, error as string);
  }
});

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
      return httpResponse.badRequestWithError(c, error.message);
    }

    return httpResponse.internalServerError(c, error as string);
  }
});

route.post("/refresh", async (c) => {
  try {
    const currentToken = getCookie(c, "refreshToken");

    if (!currentToken) {
      return httpResponse.badRequest(c, "Missing token");
    }

    const token = await authService.refreshToken(currentToken);

    return httpResponse.ok(c, {
      token,
    });
  } catch (error) {
    if (error instanceof ExpiredTokenProvidedForRefresh) {
      return httpResponse.badRequest(c, error.message);
    }

    if (error instanceof errors.JWSInvalid) {
      return httpResponse.badRequest(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

export default route;
