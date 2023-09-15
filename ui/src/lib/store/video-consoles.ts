import { writable } from "svelte/store";
import type { VideoConsole } from "../services/consoles.ts";
import consoles from "../services/consoles.ts";

export const videoConsole = writable<VideoConsole[]>([]);
export const loadVideoConsoles = async () => {
  const response = await consoles.getAll();
  videoConsole.set(response);
};
