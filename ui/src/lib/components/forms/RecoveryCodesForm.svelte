<script lang="ts">
  import toast from "svelte-french-toast";
  import {
    filedrop,
    ErrorCode,
    type Files,
    type FileDropOptions,
  } from "filedrop-svelte";
  import { replace } from "svelte-spa-router";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Textarea } from "$lib/components/ui/textarea";
  import { user } from "$lib/services";
  import type { ApiError } from "$lib/types";

  let className: string | undefined | null = undefined;
  export { className as class };

  let isLoading = false;
  let input: HTMLInputElement;
  let code: string;

  const options: FileDropOptions = {
    accept: "text/plain",
    fileLimit: 1,
    multiple: false,
    windowDrop: false,
    minSize: 20,
    maxSize: 300,
  };

  async function onSubmit() {
    try {
      isLoading = true;
      const encodedEmail = localStorage.getItem("ag-user");

      if (!encodedEmail) {
        localStorage.removeItem("ag-user");
        return replace("/forgot-password");
      }

      const email = atob(encodedEmail);
      await user.verifyRecoveryCode({
        email,
        code,
      });

      toast.success("Código verificado");

      replace("/reset-password");
    } catch (err) {
      let error = err as ApiError;

      if (error.status === 400) {
        toast.error("El código de recuperación es inválido");
        return;
      }

      toast.error("Ocurrió un error, intente de nuevo");
    } finally {
      isLoading = false;
    }
  }

  async function handleFileDrop(e: any) {
    const file = e.detail.files as Files;

    if (file.rejected.length) {
      if (file.rejected[0].error.code === ErrorCode.InvalidFileType) {
        toast.error("El archivo no es válido");
        return;
      }

      if (file.rejected[0].error.code === ErrorCode.FileSizeMinimumNotMet) {
        toast.error("El archivo es demasiado pequeño");
        return;
      }

      if (file.rejected[0].error.code === ErrorCode.FileSizeMaximumExceeded) {
        toast.error("El archivo excede el tamaño máximo");
        return;
      }

      if (file.rejected[0].error.code === ErrorCode.FileCountExceeded) {
        toast.error("Solo puede subir un archivo");
        return;
      }
      return;
    }

    try {
      code = await file.accepted[0].text();
    } catch (error) {
      toast.error("Hubo un error al leer el archivo");
    }
  }
</script>

<div class={cn("grid gap-6", className)} {...$$restProps}>
  <form on:submit|preventDefault={onSubmit}>
    <div class="grid gap-2">
      <Tabs.Root value="file">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="file">Archivo</Tabs.Trigger>
          <Tabs.Trigger value="text">Texto</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="file">
          <div class="w-full">
            <button
              class="h-40 border border-dashed border-secondary p-4 rounded-md bg-secondary text-sm text-primary flex flex-col items-center justify-center gap-2 w-full"
              type="button"
              on:click={() => {
                input.click();
              }}
              use:filedrop={options}
              on:filedrop={(e) => handleFileDrop(e)}
              disabled={isLoading}
            >
              {#if code}
                <div class="i-ph-check-circle text-4xl text-primary" />
                Archivo leido
              {:else}
                <div class="i-ph-file text-4xl text-primary" />
                Haz click o arrastra y suelta el archivo
              {/if}
            </button>
            <input type="file" hidden={true} bind:this={input} />
          </div>
        </Tabs.Content>
        <Tabs.Content value="text">
          <Textarea
            placeholder="Pega el código aquí"
            class="h-40 resize-none"
            bind:value={code}
            disabled={isLoading}
          />
        </Tabs.Content>
      </Tabs.Root>

      <Button disabled={isLoading || !code}>
        {#if isLoading}
          <span class="i-ph-circle-notch-bold text-lg animate-spin mr-2" />
        {/if}
        Verificar código
      </Button>
    </div>
  </form>
</div>
