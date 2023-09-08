<script lang="ts">
  import toast from "svelte-french-toast";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";
  import { authenticated } from "../store";
  import auth from "$lib/services/auth";
  import type { ApiError } from "$lib/types";
  import { replace } from "svelte-spa-router";

  let className: string | undefined | null = undefined;
  export { className as class };

  let isLoading = false;
  let email = "";
  let password = "";

  async function onSubmit() {
    try {
      isLoading = true;
      await auth.login({ email, password });
      toast.success("Inicio de sesión exitoso");

      $authenticated = true;
      replace("/");
    } catch (err) {
      let error = err as ApiError;
      if (error.status === 401) {
        return toast.error("Credenciales incorrectas");
      }

      toast.error("Ocurrió un error, intente de nuevo");
    } finally {
      isLoading = false;
      password = "";
    }
  }
</script>

<div class={cn("grid gap-6", className)} {...$$restProps}>
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
      <div class="grid gap-1">
        <Label class="sr-only" for="password">Password</Label>
        <Input
          id="password"
          placeholder="**********"
          type="password"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off"
          disabled={isLoading}
          bind:value={password}
        />
      </div>
      <Button disabled={isLoading}>
        {#if isLoading}
          <span class="i-ph-circle-notch-bold text-lg animate-spin mr-2" />
        {/if}
        Iniciar sesión
      </Button>
    </div>
  </form>
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t" />
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-background px-2 text-muted-foreground">
        O registrate
      </span>
    </div>
  </div>
  <Button variant="outline" type="button" disabled={isLoading}>Registrar</Button
  >
</div>
