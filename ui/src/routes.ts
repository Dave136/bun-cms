import { wrap } from "svelte-spa-router/wrap";

import Login from "./pages/login.svelte";
import Index from "./pages/index.svelte";
import Collections from "./pages/collections.svelte";

function checkAuthToken() {
  if (!localStorage.getItem("ag-token")) {
    return false;
  }

  return true;
}

const routes = {
  "/login": wrap({
    component: Login as any,
    conditions: () => !checkAuthToken(),
    userData: { showSidebar: false },
  }),
  "/collections": wrap({
    component: Collections as any,
    conditions: () => checkAuthToken(),
    userData: { showSidebar: true },
  }),
  // catch-all fallback
  "*": wrap({
    component: Index as any,
    userData: { showSidebar: false },
  }),
};

export default routes;
