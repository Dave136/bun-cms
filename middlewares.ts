import { Context, Next } from "hono";
import httpResponse from "./utils/http-response.ts";
import { bearerAuth, BearerAuthError } from "./modules/auth/utils.ts";
import { jwtVerify } from "jose";

const jwtPrivateKey = new TextEncoder().encode(Deno.env.get("JWT_PRIVATE_KEY"));

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
