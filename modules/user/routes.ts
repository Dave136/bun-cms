import { Hono } from "hono";
import httpResponse from "../../utils/http-response.ts";
import * as service from "./services.ts";
import { Role } from "./model.ts";
import {
  InvalidRecoveryCodeFormat,
  InvalidRecoveryCodes,
  UserByEmailNotFound,
} from "./error.ts";

const route = new Hono();

route.get("/check-admin", async (c) => {
  try {
    const admin = await service.findByRole(Role.Admin);

    return httpResponse.ok(c, { adminExist: !!admin });
  } catch (error) {
    return httpResponse.internalServerError(c, error);
  }
});

// TODO
// Como limitar en mi API la cantidad de intentos para la verificacion del codigo de recuperacion?
// Que mecanismos seguros deberia de aplicar?

route.post("/verify-codes", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.code) {
      return httpResponse.badRequest(c, "Missing recovery code");
    }

    await service.verifyRecoveryCodes(body);

    return httpResponse.ok(c, {
      message: "Recovery codes verified",
      verified: true,
    });
  } catch (error) {
    if (error instanceof InvalidRecoveryCodeFormat) {
      return httpResponse.badRequest(c, error.message);
    }

    if (error instanceof InvalidRecoveryCodes) {
      return httpResponse.badRequest(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

route.post("/exists", async (c) => {
  try {
    const { email } = await c.req.json();
    await service.findByEmail(email);

    return httpResponse.ok(c, { message: "user exists" });
  } catch (error) {
    console.log(error);
    if (error instanceof UserByEmailNotFound) {
      return httpResponse.notFound(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

// TODO: Add middleware to validate the reset password token
route.post("/reset-password", async (c) => {
  try {
    const { email, newPassword } = await c.req.json();
    const token = c.req.headers.get("X-Password-Reset-Token");

    if (!token) {
      return httpResponse.badRequest(c, "Missing reset token");
    }

    if (token !== "reset-token-value") {
      return httpResponse.badRequest(c, "Invalid reset token");
    }

    await service.updatePassword(email, newPassword);

    return httpResponse.ok(c, {
      message: "Password resetted",
    });
  } catch (error) {
    if (error instanceof UserByEmailNotFound) {
      return httpResponse.notFound(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

route.post(
  "/:id",
  (c) => {
    return c.json({
      message: "ok",
    });
  },
);

export default route;
