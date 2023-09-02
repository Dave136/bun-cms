import {
  AdminUserAlreadyExists,
  UserByEmailNotFound,
  UserWithIDNotFound,
} from "./error.ts";
import UserModel, { Role, User } from "./model.ts";

interface CreateUserDTO {
  name: string;
  password: string;
  email: string;
  role: Role;
}

export async function createPassword(password: string): Promise<string> {
  // TODO: encrypt password
  return password;
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
  user.email = userDto.email;
  user.password = await createPassword(userDto.password);
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
