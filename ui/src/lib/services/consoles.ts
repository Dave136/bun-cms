import { api } from "../config/redaxios.ts";

type ActionConsolePayload = {
  name: string;
};

export interface VideoConsole {
  _id: string;
  name: string;
  games: any[];
  createdAt: string;
  updatedAt: string;
}

async function getAll(): Promise<VideoConsole[]> {
  try {
    const { data: { data } } = await api.get("/consoles");
    return data;
  } catch (error) {
    throw error;
  }
}

async function create(data: ActionConsolePayload) {
  try {
    await api.post("/consoles", data);
  } catch (error) {
    throw error;
  }
}

async function update(id: string, data: ActionConsolePayload) {
  try {
    await api.put(`/consoles/${id}`, data);
  } catch (error) {
    throw error;
  }
}

async function remove(id: string) {
  try {
    await api.delete(`/consoles/${id}`);
  } catch (error) {
    throw error;
  }
}

export default {
  getAll,
  create,
  update,
  remove,
};
