<script lang="ts">
  import Router, { replace, link } from "svelte-spa-router";
  import { Toaster } from "svelte-french-toast";
  import active from "svelte-spa-router/active";
  import { authenticated } from "$lib/store";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import AppTheme from "$lib/components/AppTheme.svelte";
  import routes from "./routes";
  import logo from "./assets/logo.svg";
  import logoDark from "./assets/logo-dark.svg";
  import auth from "$lib/services/auth";

  let oldLocation = "";
  let showSidebar = false;

  function handleRouteLoading(e: any) {
    if (e?.detail?.location === oldLocation) {
      return;
    }

    oldLocation = e.detail.location;
    showSidebar = !!e.detail.userData.showSidebar;
  }

  function handleRouteFailure() {
    replace("/");
  }
</script>

<div class="w-full flex min-h-screen">
  {#if $authenticated && showSidebar}
    <aside
      class="z-[0] flex flex-col w-[.625rem] min-w-[5.5rem] max-w-[6rem] flex-shrink-0 flex-grow-0 overflow-x-hidden overflow-y-auto bg-secondary p-6 border-r"
    >
      <a
        class="relative align-top inline-flex justify-center items-center gap-2 text-xl select-none"
        href="/"
        use:link
      >
        <img
          class="dark:hidden"
          src={logoDark}
          alt="Alfagame Logo"
          width="40"
          height="40"
        />
        <img
          class="hidden dark:block"
          src={logo}
          alt="Alfagame Logo"
          width="40"
          height="40"
        />
      </a>

      <nav
        class="w-full flex flex-col items-center justify-start gap-6 text-lg flex-grow"
      >
        <a
          href="/collections"
          aria-label="Collections"
          class="relative outline-0 cursor-pointer inline-flex items-center text-center justify-center select-none min-w-[2.8125rem] py-1 max-w-[2.8125rem] border-2 transition mt-6 rounded-md"
          use:link
          use:active={{
            path: "/collections/?.*",
            className: "border-primary",
          }}
        >
          <div class="i-ph-database text-3xl text-primary" />
        </a>
      </nav>

      <figure>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button
              class="w-10 h-10 rounded-full bg-secondary-foreground border-primary text-secondary text-sm flex items-center justify-center"
            >
              AG
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item on:click={() => console.log("admin")}>
                <div class="i-ph-user mr-2" />
                <span>Admin</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item on:click={() => auth.logout()}>
                <div class="i-ph-sign-out mr-2" />
                <span>Cerrar sesión</span>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </figure>
    </aside>
  {/if}
  <div
    class="flex-grow min-h-full flex items-stretch {$authenticated
      ? 'min-w-[650px]'
      : 'min-w-0'}"
  >
    <Router
      {routes}
      on:routeLoading={handleRouteLoading}
      on:conditionsFailed={handleRouteFailure}
    />

    <Toaster
      position="bottom-right"
      toastOptions={{
        style:
          "background: var(--primary); color: var(--primary); border: .0625rem solid var(--notify-bg);",
      }}
    />

    <AppTheme />
  </div>
</div>
