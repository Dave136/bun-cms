import { api } from "$lib/config/redaxios";

async function adminExists() {
  try {
    const { status } = await api.get("/users/check-admin");
    return status === 200;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }

    throw error;
  }
}

export default {
  adminExists,
};
