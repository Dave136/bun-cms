<script lang="ts">
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import { authenticated } from "$lib/store";
  import { user } from "$lib/services";
  import toast from "svelte-french-toast";
  import AdminForm from "$lib/components/AdminForm.svelte";
  import AuthWrapper from "$lib/components/AuthWrapper.svelte";

  let createAdmin = false;

  async function init() {
    try {
      createAdmin = false;
      const admin = await user.adminExists();

      if (!$authenticated && admin) {
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
      toast.error("Un error ocurrió al cargar el sitio, reinicie la página");
    }
  }

  onMount(() => {
    init();
  });
</script>

<div class="min-h-screen flex justify-center w-full">
  {#if createAdmin}
    <AuthWrapper
      description="Crea tu primera cuenta de administrador para poder continuar"
    >
      <AdminForm />
    </AuthWrapper>
  {/if}
</div>
