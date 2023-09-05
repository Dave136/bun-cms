import { GameWithIDNotFound } from "./error.ts";
import GameModel, { IGame } from "./model.ts";
import * as consoleServices from "../consoles/service.ts";
import { ConsoleWithIDNotFound } from "../consoles/error.ts";

export interface CreateGameDTO {
  id: string;
  title: string;
  image: string | null;
  genre: string[] | null;
  consoleId: string;
}

export async function getAll() {
  return await GameModel.find();
}

export async function findById(id: string): Promise<IGame> {
  const result = await GameModel.findById(id);

  if (!result) {
    throw new GameWithIDNotFound(id);
  }

  return result;
}

export async function create(dto: CreateGameDTO): Promise<void> {
  const consoleModel = await consoleServices.findById(dto.consoleId);
  const created = await GameModel.create(dto);

  if (!consoleModel) {
    throw new ConsoleWithIDNotFound(dto.consoleId);
  }

  consoleModel.games.push(created._id);

  await consoleModel.save();
}

export async function update(id: string, dto: CreateGameDTO): Promise<void> {
  await GameModel.findByIdAndUpdate(id, dto);
}

export async function remove(id: string): Promise<void> {
  await GameModel.findByIdAndDelete(id);
}
