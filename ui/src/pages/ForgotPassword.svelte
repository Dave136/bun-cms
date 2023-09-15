<script lang="ts">
  import { onMount } from "svelte";
  import { pop, replace } from "svelte-spa-router";
  import AuthWrapper from "$lib/components/AuthWrapper.svelte";
  import EmailRecoveryForm from "$lib/components/forms/EmailRecoveryForm.svelte";
  import RecoveryCodesForm from "$lib/components/forms/RecoveryCodesForm.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let title = "Contraseña olvidada";
  let description = "Ingrese el correo electrónico asociado con su cuenta:";

  let isVerified = false;

  $: if (isVerified) {
    title = "Códigos de recuperación";
    description = "Ingrese el código de recuperación:";
  }

  onMount(() => {
    const user = localStorage.getItem("ag-user");
    isVerified = !!user;
  });
</script>

<AuthWrapper {title} {description}>
  {#if !isVerified}
    <EmailRecoveryForm
      on:done={() => {
        isVerified = true;
      }}
    />
  {:else}
    <RecoveryCodesForm />
  {/if}

  <Button
    variant="link"
    on:click={() => {
      if (isVerified) {
        replace("/forgot-password");
      } else {
        replace("/login");
      }
    }}>Volver</Button
  >
</AuthWrapper>
