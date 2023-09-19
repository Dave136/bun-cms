export type Credentials = {
  email: string;
  password: string;
};

export class BasicAuthError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "BasicAuthError";
    this.message = message;
  }
}

export class BearerAuthError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "BearerAuthError";
    this.message = message;
  }
}

export function bearerAuth(authorization: string | null): string {
  if (typeof authorization !== "string") {
    throw new BearerAuthError("Invalid 'Authorization' header value provided");
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2) {
    throw new BearerAuthError("Invalid 'Authorization' header value provided");
  }

  return parts[1];
}
