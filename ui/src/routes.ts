import { wrap } from "svelte-spa-router/wrap";

import Login from "./pages/login.svelte";
import Index from "./pages/index.svelte";
import Collections from "./pages/Collections.svelte";
import { authenticated } from "./lib/store";

function isValid() {
  const token = localStorage.getItem("ag-token");

  if (!token) {
    localStorage.removeItem("ag-token");
    authenticated.set(false);
    return false;
  }

  return true;
}

const routes = {
  "/login": wrap({
    component: Login as any,
    conditions: () => !isValid(),
    userData: { showSidebar: false },
  }),
  "/forgot-password": wrap({
    asyncComponent: () => import("./pages/ForgotPassword.svelte"),
    conditions: () => !isValid(),
    userData: { showSidebar: false },
  }),
  "/reset-password": wrap({
    asyncComponent: () => import("./pages/ResetPassword.svelte"),
    conditions: () => !isValid(),
    userData: { showSidebar: false },
  }),
  "/collections": wrap({
    component: Collections as any,
    conditions: () => isValid(),
    userData: { showSidebar: true },
  }),
  // catch-all fallback
  "*": wrap({
    component: Index as any,
    userData: { showSidebar: false },
  }),
};

export default routes;
