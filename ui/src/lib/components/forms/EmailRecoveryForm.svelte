<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import toast from "svelte-french-toast";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";
  import users from "$lib/services/users";
  import type { ApiError } from "$lib/types";

  const dispatch = createEventDispatcher();

  let className: string | undefined | null = undefined;
  export { className as class };

  let isLoading = false;
  let email = "";

  async function onSubmit() {
    try {
      isLoading = true;
      await users.userExists(email);
      toast.success("Email veficado");

      localStorage.setItem("ag-user", btoa(email));

      dispatch("done");
    } catch (err) {
      let error = err as ApiError;
      if (error.status === 404) {
        return toast.error("Usuario inexistente");
      }

      toast.error("Ocurrió un error, intente de nuevo");
    } finally {
      isLoading = false;
    }
  }
</script>

<div class={cn("grid gap-6", className)} {...$$restProps} in:fade>
  <form on:submit|preventDefault={onSubmit}>
    <div class="grid gap-2">
      <div class="grid gap-1">
        <Label class="sr-only" for="email">Email</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autocapitalize="none"
          autocomplete="email"
          autocorrect="off"
          bind:value={email}
          disabled={isLoading}
        />
      </div>
      <Button disabled={isLoading}>
        {#if isLoading}
          <span class="i-ph-circle-notch-bold text-lg animate-spin mr-2" />
        {/if}
        Verificar correo
      </Button>
    </div>
  </form>
</div>
