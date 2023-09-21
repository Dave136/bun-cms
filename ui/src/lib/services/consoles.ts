import { api } from "$lib/config/api";

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
    const {
      data: { data },
    } = await api("/consoles");
    return data;
  } catch (error) {
    throw error;
  }
}

async function create(data: ActionConsolePayload) {
  try {
    await api("/consoles", {
      method: "post",
      body: data,
    });
  } catch (error) {
    throw error;
  }
}

async function update(id: string, data: ActionConsolePayload) {
  try {
    await api(`/consoles/${id}`, {
      method: "put",
      body: data,
    });
  } catch (error) {
    throw error;
  }
}

async function remove(id: string) {
  try {
    await api(`/consoles/${id}`, {
      method: "delete",
    });
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
