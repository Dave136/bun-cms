import { api } from "$lib/config/redaxios";

async function adminExists() {
  try {
    const data = await api("/users/check-admin");
    return data.adminExist;
  } catch (error) {
    throw error;
  }
}

async function verifyRecoveryCode(payload: {
  code: string;
  email: string;
}): Promise<string> {
  try {
    const data = await api("/users/verify-codes", {
      method: "post",
      body: payload,
    });
    return data.token;
  } catch (error) {
    throw error;
  }
}

async function userExists(email: string) {
  try {
    const data = await api(`/users/exists`, {
      method: "post",
      body: {
        email,
      },
    });
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

    await api(`/users/reset-password`, {
      body: {
        email,
        newPassword,
      },
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
