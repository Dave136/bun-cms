import { ConsoleWithIDNotFound } from "./error.ts";
import ConsoleModel, { IConsole } from "./model.ts";
import GameModel from "../games/model.ts";

export interface CreateConsoleDTO {
  name: string;
}

export async function getAll(): Promise<IConsole[]> {
  return await ConsoleModel.find().populate("games");
}

export async function findById(id: string): Promise<IConsole> {
  const result = await ConsoleModel.findById(id).populate("games");

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
  await GameModel.deleteMany({ consoleId: id });
}
