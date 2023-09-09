import { api } from "$lib/config/redaxios";

async function adminExists() {
  try {
    const { data } = await api.get("/users/check-admin");
    return data.adminExist;
  } catch (error) {
    throw error;
  }
}

export default {
  adminExists,
};
