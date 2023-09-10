import { api } from "$lib/config/redaxios";

async function adminExists() {
  try {
    const { data } = await api.get("/users/check-admin");
    return data.adminExist;
  } catch (error) {
    throw error;
  }
}

async function verifyRecoveryCode(
  payload: { code: string; email: string },
): Promise<void> {
  try {
    await api.post("/users/verify-codes", payload);
  } catch (error) {
    throw error;
  }
}

async function userExists(email: string) {
  try {
    const { data } = await api.post(`/users/exists`, { email });
    return data.message;
  } catch (error) {
    throw error;
  }
}

async function resetPassword(email: string, newPassword: string) {
  try {
    await api.post(`/users/reset-password`, { email, newPassword }, {
      headers: {
        "X-Password-Reset-Token": "reset-token-value",
      },
    });
  } catch (error) {
    throw error;
  }
}

export default {
  adminExists,
  userExists,
  verifyRecoveryCode,
  resetPassword,
};
