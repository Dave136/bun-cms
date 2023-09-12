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
): Promise<string> {
  try {
    const { data } = await api.post("/users/verify-codes", payload);
    return data.token;
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
    const resetToken = localStorage.getItem("ag-reset-token");

    if (!resetToken) {
      throw new Error("An error occurred when attempting to reset password");
    }

    await api.post(`/users/reset-password`, { email, newPassword }, {
      headers: {
        "X-Password-Reset-Token": resetToken,
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
