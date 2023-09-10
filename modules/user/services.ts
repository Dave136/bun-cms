import { toHex } from "../../utils/index.ts";
import {
  AdminUserAlreadyExists,
  InvalidRecoveryCodeFormat,
  InvalidRecoveryCodes,
  UserByEmailNotFound,
  UserWithIDNotFound,
} from "./error.ts";
import UserModel, { Role, User } from "./model.ts";

interface CreateUserDTO {
  name: string;
  lastname: string;
  password: string;
  email: string;
  role: Role;
}

function generateRecoveryCodes() {
  const recoveryCodes = [];

  for (let i = 0; i < 10; i++) {
    const code = crypto.getRandomValues(new Uint8Array(10));
    recoveryCodes.push(toHex(code));
  }

  return recoveryCodes;
}

export async function verifyRecoveryCodes(
  { code, email }: { code: string; email: string },
): Promise<boolean> {
  const codes = code.split(".");

  if (codes.length < 10) {
    throw new InvalidRecoveryCodeFormat();
  }

  const user = await findByEmail(email);
  const verified = codes.every((code) => user.recoveryCodes.includes(code));

  if (!verified) {
    throw new InvalidRecoveryCodes();
  }

  // compara los códigos de recuperación con los del usuario
  return verified;
}

export async function getAll() {
  return await UserModel.find();
}

export async function create(userDto: CreateUserDTO): Promise<User> {
  if (userDto.role === Role.Admin) {
    const adminUser = await UserModel.findOne({
      role: Role.Admin,
    });

    if (adminUser) {
      throw new AdminUserAlreadyExists();
    }
  }

  const user = new UserModel();

  user.name = userDto.name;
  user.lastname = userDto.lastname;
  user.email = userDto.email;
  user.password = userDto.password;
  user.recoveryCodes = generateRecoveryCodes();
  user.role = userDto.role as Role;

  await user.save();

  return user;
}

export async function findById(id: string): Promise<User> {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new UserWithIDNotFound(id);
  }

  return user;
}

export async function findByEmail(email: string): Promise<User> {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UserByEmailNotFound(email);
  }

  return user;
}

export async function findByRole(role: Role): Promise<User | null> {
  return await UserModel.findOne({ role });
}

export async function refreshToken(
  email: string,
  token: string,
): Promise<User> {
  const user = await findByEmail(email);

  user.refreshToken = token;

  await user.save();

  return user;
}

export async function clearRefreshToken(email: string) {
  const user = await findByEmail(email);

  user.refreshToken = null;

  await user.save();

  return user;
}

export async function updatePassword(
  email: string,
  newPassword: string,
): Promise<void> {
  const user = await findByEmail(email);

  user.password = newPassword;

  await user.save();
}
