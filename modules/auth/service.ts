import { jwtVerify, SignJWT } from "jose";
import { Role, User } from "../user/model.ts";
import * as userService from "../user/services.ts";
import { InvalidCredentials } from "../user/error.ts";
import { ExpiredTokenProvidedForRefresh } from "./error.ts";

export type RegisterDTO = {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Tokens = {
  token: string;
  refreshToken: string;
};

const jwtPrivateKey = new TextEncoder().encode(Deno.env.get("JWT_PRIVATE_KEY"));
const jwtResetPasswordPrivateKey = new TextEncoder().encode(
  Deno.env.get("RESET_PASSWORD_PRIVATE_KEY"),
);

async function signToken(user: User): Promise<string> {
  const signed = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Deno.env.get("JWT_EXPIRATION") ?? "15min")
    .sign(jwtPrivateKey);

  return signed;
}

async function signPasswordResetToken(user: Partial<User>): Promise<string> {
  const signed = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Deno.env.get("JWT_RESET_PASSWORD_EXPIRATION") as string)
    .sign(jwtResetPasswordPrivateKey);

  return signed;
}

async function signRefreshToken(user: User): Promise<string> {
  const signed = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Deno.env.get("JWT_REFRESH_TOKEN_EXPIRATION") ?? "1d")
    .sign(jwtPrivateKey);

  return signed;
}

async function generateTokens(user: User): Promise<[string, string]> {
  const token = await signToken(user);
  const refreshToken = await signRefreshToken(user);

  return [token, refreshToken];
}

export async function generateResetPasswordToken(email: string) {
  const token = await signPasswordResetToken({ email });
  return token;
}

export async function authenticate({ email, password }: Credentials) {
  const user = await userService.findByEmail(email);

  if (!user) throw new InvalidCredentials();

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) throw new InvalidCredentials();

  const [token, refreshToken] = await generateTokens(user);

  userService.refreshToken(user.email, refreshToken);

  return {
    token,
    refreshToken,
  };
}

export async function register(dto: RegisterDTO): Promise<void> {
  await userService.create(dto);
}

export async function refreshToken(refreshToken: string): Promise<string> {
  const { payload } = await jwtVerify(
    refreshToken,
    jwtPrivateKey,
  );

  const user = await userService.findByEmail(payload.email as string);

  if (user.refreshToken === refreshToken) {
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;

    const newToken = await signToken(user);

    return newToken;
  }

  throw new ExpiredTokenProvidedForRefresh();
}

export async function endSession(token: string): Promise<void> {
  const { payload: claims } = await jwtVerify(token, jwtPrivateKey);
  await userService.clearRefreshToken(claims.email as string);
}
