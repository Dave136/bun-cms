import { Context, Next } from "hono";
import httpResponse from "./utils/http-response.ts";
import { bearerAuth, BearerAuthError } from "./modules/auth/utils.ts";
import { errors, jwtVerify } from "jose";

const jwtPrivateKey = new TextEncoder().encode(Deno.env.get("JWT_PRIVATE_KEY"));
const jwtResetPasswordPrivateKey = new TextEncoder().encode(
  Deno.env.get("RESET_PASSWORD_PRIVATE_KEY"),
);

export async function verifyJWT(c: Context, next: Next) {
  try {
    const authorization = c.req.headers.get("authorization");

    const token = bearerAuth(authorization);

    const decoded = await jwtVerify(token, jwtPrivateKey);

    c.set("user", decoded.payload);

    await next();
  } catch (error) {
    console.error(error);

    if (error instanceof BearerAuthError) {
      return httpResponse.badRequest(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
}

export async function verifyResetPasswordJWT(c: Context, next: Next) {
  try {
    const token = c.req.headers.get("X-Password-Reset-Token");

    if (!token) {
      return httpResponse.badRequest(c, "Missing reset token");
    }

    await jwtVerify(token, jwtResetPasswordPrivateKey);

    await next();
  } catch (error) {
    if (error instanceof errors.JWTClaimValidationFailed) {
      return httpResponse.badRequest(c, error.message);
    }

    if (error instanceof errors.JWTExpired) {
      return httpResponse.badRequest(c, error.message);
    }

    if (error instanceof errors.JWTExpired) {
      return httpResponse.badRequest(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
}
