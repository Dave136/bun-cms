<script lang="ts">
  import Breadcrumb from "../common/Breadcrumb.svelte";
  import Button from "../ui/button/button.svelte";
  import DataTable from "./DataTable.svelte";
  import { loc } from "svelte-spa-router";
  import DataTableGames from "./games/DataTableGames.svelte";
  import * as Sheet from "../ui/sheet";
  import VideConsolesForm from "./video-consoles/VideConsolesForm.svelte";
  import toast from "svelte-french-toast";
  import consolesService from "$lib/services/consoles";
  import { loadVideoConsoles, videoConsole } from "$lib/store/video-consoles";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { cn } from "$lib/utils";
  import { buttonVariants } from "../ui/button";

  let sheetMode: "create" | "edit" | "delete" = "create";
  let name = "";
  let id = "";

  $: section = $loc.querystring?.replace("id=", "");

  function closeTrigger() {
    (document.getElementById("triggerClose") as HTMLButtonElement).click();
  }

  function openTrigger() {
    (document.getElementById("trigger") as HTMLButtonElement).click();
  }

  function openTriggerAlert() {
    (document.getElementById("triggerAlert") as HTMLButtonElement).click();
  }

  function registerRecord() {
    if (!section) return;

    const actions: { [key: string]: () => void } = {
      async consoles() {
        try {
          if (!name) {
            toast.error("Nombre de consola requerido");
            return;
          }

          await consolesService.create({ name });
          toast.success("Consola registrada");
          loadVideoConsoles();
        } catch (error) {
          toast.error("Error al registrar consola");
        } finally {
          closeTrigger();
        }
      },
      games() {
        alert("registering new game");
        // close
        closeTrigger();
      },
    };

    actions[section]();
  }

  function updateRecord() {
    if (!section) return;

    const actions: { [key: string]: () => void } = {
      async consoles() {
        try {
          if (!name) {
            toast.error("Nombre de consola no puede estar vacío");
            return;
          }

          await consolesService.update(id, { name });
          toast.success("Registro actualizado");
          loadVideoConsoles();
        } catch (error) {
          toast.error("Error al registrar consola");
        } finally {
          closeTrigger();
          id = "";
        }
      },
      games() {
        alert("registering new game");
        // close
        closeTrigger();
      },
    };

    actions[section]();
  }

  function deleteRecord() {
    if (!section) return;

    const actions: { [key: string]: () => void } = {
      async consoles() {
        try {
          if (!id) {
            return;
          }

          await consolesService.remove(id);
          toast.success("Registro eliminado");
          loadVideoConsoles();
        } catch (error) {
          toast.error("Error al eliminar el registro");
        } finally {
          closeTrigger();
          id = "";
        }
      },
      games() {
        alert("registering new game");
        // close
        closeTrigger();
      },
    };

    actions[section]();
  }

  function handleCreate() {
    sheetMode = "create";
    openTrigger();
  }

  function handleUpdate({ detail }) {
    sheetMode = "edit";
    id = detail.id;

    if (section === "consoles") {
      const item = $videoConsole.find((c) => c._id === detail.id);
      name = item!.name;
    }

    openTrigger();
  }

  function handleClickAction() {
    if (sheetMode === "create") {
      registerRecord();
    } else if (sheetMode === "edit") {
      updateRecord();
    } else if (sheetMode === "delete") {
      deleteRecord();
    }
  }

  function handleDelete({ detail }) {
    id = detail.id;
    sheetMode = "delete";
    openTriggerAlert();
  }

  function handleRefresh() {
    if (section === "consoles") {
      loadVideoConsoles();
    }

    toast.success("Registros actualizados");
  }
</script>

<section class="w-full bg-transparent text-primary p-6 px-10">
  <header class="flex gap-1 items-center mb-4">
    <Breadcrumb {section} />
    <Button variant="ghost" class="rounded-full ml-4" on:click={handleRefresh}>
      <div class="i-ph-arrows-clockwise text-lg" />
    </Button>
  </header>
  {#if section === "consoles"}
    <DataTable
      on:update={handleUpdate}
      on:add={handleCreate}
      on:remove={handleDelete}
    />
  {:else if section === "games"}
    <DataTableGames />
  {/if}
</section>

<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button id="trigger" builders={[builder]} class="hidden" variant="outline">
      Open
    </Button>
  </Sheet.Trigger>
  <Sheet.Content side="right" class="flex-1">
    <Sheet.Header>
      <Sheet.Title
        >{sheetMode === "create" ? "Crear" : "Actualizar"}
        {section}</Sheet.Title
      >
      <Sheet.Description>Crea un nuevo registro</Sheet.Description>
    </Sheet.Header>
    <div class="grid gap-4 py-4">
      {#if section === "consoles"}
        <VideConsolesForm bind:name />
      {:else if section === "games"}
        <p>Games Form goes here...</p>
      {/if}
    </div>
    <Sheet.Footer>
      <Sheet.Close asChild let:builder>
        <Button class="hidden" id="triggerClose" builders={[builder]}
          >Close</Button
        >
        <Button type="button" on:click={handleClickAction}
          >{sheetMode === "create" ? "Crear" : "Actualizar"}</Button
        >
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

<AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
    <Button
      id="triggerAlert"
      builders={[builder]}
      class="hidden"
      variant="outline"
    >
      Open
    </Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title
        >¿Realmente desea eliminar el registro seleccionado?</AlertDialog.Title
      >
      <AlertDialog.Description>
        Esta acción no se puede deshacer. Esto eliminará permanentemente el
        registro y eliminará los datos de nuestros servidores.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>No</AlertDialog.Cancel>
      <AlertDialog.Action
        class={cn(buttonVariants({ variant: "destructive" }))}
        on:click={handleClickAction}>Sí</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
