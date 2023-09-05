import { ConsoleWithIDNotFound } from "./error.ts";
import ConsoleModel, { IConsole } from "./model.ts";

export interface CreateConsoleDTO {
  name: string;
}

export async function getAll() {
  return await ConsoleModel.find();
}

export async function findById(id: string): Promise<IConsole> {
  const result = await ConsoleModel.findById(id);

  if (!result) {
    throw new ConsoleWithIDNotFound(id);
  }

  return result;
}

export async function create(dto: CreateConsoleDTO): Promise<void> {
  await ConsoleModel.create(dto);
}

export async function update(id: string, dto: CreateConsoleDTO): Promise<void> {
  await ConsoleModel.findByIdAndUpdate(id, dto);
}

export async function remove(id: string): Promise<void> {
  await ConsoleModel.findByIdAndDelete(id);
}
