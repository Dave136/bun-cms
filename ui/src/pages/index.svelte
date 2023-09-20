<script lang="ts">
  import { onMount, tick } from "svelte";
  import { replace } from "svelte-spa-router";
  import { authenticated } from "$lib/store";
  import { user } from "$lib/services";
  import toast from "svelte-french-toast";
  import AdminForm from "$lib/components/AdminForm.svelte";
  import AuthWrapper from "$lib/components/AuthWrapper.svelte";
  import RecoveryCodes from "$lib/components/RecoveryCodes.svelte";
  import FullPage from "$lib/components/base/FullPage.svelte";

  let createAdmin = false;
  let showCodes = false;
  let codes = "";

  async function init() {
    try {
      createAdmin = false;
      const admin = await user.adminExists();

      if (showCodes && codes) return;

      if (!$authenticated && !admin) {
        createAdmin = true;
        return;
      }

      if ($authenticated) {
        replace("/collections");
      } else {
        localStorage.removeItem("ag-token");
        replace("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Un error ocurrió al cargar el sitio, reinicie la página");
    }
  }

  onMount(() => {
    init();
  });
</script>

<div class="min-h-screen flex justify-center w-full">
  {#if createAdmin && !showCodes}
    <AuthWrapper
      description="Crea tu primera cuenta de administrador para poder continuar"
    >
      <AdminForm
        on:submit={async ({ detail }) => {
          showCodes = true;
          codes = detail.codes;
        }}
      />
    </AuthWrapper>
  {:else if showCodes}
    <FullPage
      title="Códigos de recuperación"
      description="Por favor, guarde el código de recuperación, importante para recuperar la cuenta"
    >
      <RecoveryCodes
        {codes}
        on:continue={() => {
          showCodes = false;
          init();
        }}
      />
    </FullPage>
  {/if}
</div>
