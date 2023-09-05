import { Context } from "hono";

enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

const isDevelopment = Deno.env.get("DENO_ENV") === "development";

export default {
  badRequest(c: Context, message: string) {
    return c.json({
      message,
    }, HttpStatus.BadRequest);
  },
  badRequestWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.BadRequest);
  },
  created(c: Context, payload: Record<string, any>) {
    return c.json(payload, HttpStatus.Created);
  },
  createdWithError(c: Context, message?: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.Created);
  },
  forbidden(c: Context, message: string) {
    return c.json({
      message,
    }, HttpStatus.Forbidden);
  },
  forbiddenWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.Forbidden);
  },
  internalServerError(c: Context, message: string) {
    return c.json({
      message,
    }, HttpStatus.InternalServerError);
  },
  internalServerErrorWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.InternalServerError);
  },
  noContent(c: Context) {
    return c.status(HttpStatus.NoContent);
  },
  noContentWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.NoContent);
  },
  notFound(c: Context, message: string) {
    return c.json({
      message,
    }, HttpStatus.NotFound);
  },
  notFoundWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.NotFound);
  },
  ok(c: Context, payload: Record<string, unknown>) {
    return c.json(payload, HttpStatus.Ok);
  },
  okWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.Ok);
  },
  unauthorized(c: Context, message: string) {
    return c.json({
      message,
    }, HttpStatus.Unauthorized);
  },
  unauthorizedWithError(c: Context, message: string, error?: Error) {
    return c.json({
      message,
      error: isDevelopment ? error : undefined,
    }, HttpStatus.Unauthorized);
  },
};
